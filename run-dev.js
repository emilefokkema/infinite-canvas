const fs = require("fs");
const { exec } = require('child_process');
var static = require('node-static');
var http = require('http');

var debounce = function(f, timeout){
	var goingToCall = false;
	return function(){
		if(goingToCall){
			return;
		}
		var args = Array.prototype.slice.apply(arguments);
		goingToCall = true;
		setTimeout(function(){
			f.apply(null, args.concat([function(){
				goingToCall = false;
			}]));
		}, timeout);
	};
};

var webpackWatch = function(){
	var ls = exec("webpack --mode=development --watch", (error, stdout, stderr) => {
		if (error) {
			console.error(`exec error: ${error}`);
			return;
		}
		console.log(`stdout: ${stdout}`);
		console.error(`stderr: ${stderr}`);	
	});
	ls.stdout.on('data', (data) => {
		console.log(`stdout: ${data}`);
	});
};

var serveFiles = function(){
	var file = new(static.Server)('./dist', {cache: 0});
	http.createServer(function (req, res) {
		file.serve(req, res);
	}).listen(8080);
	console.log("listening on port 8080...");
};

var File = function(fileName){
	this.src = "./devtools/" + fileName;
	this.dest = "./dist/" + fileName;
};

File.prototype.copy = function(){
	var resolve, reject;
	var promise = new Promise((res, rej) => {resolve = res; reject = rej;});
	fs.copyFile(this.src, this.dest, (err) => {
		if(err){
			reject(err);
		}else{
			console.log("copied file "+this.src+" to "+this.dest);
			resolve();
		}
	});
	return promise;
};

File.prototype.copyAndWatch = async function(){
	await this.copy();
	fs.watch(this.src, debounce((eventType, fileName, done) => {
		this.copy().then(done);
	}, 200));
};

if(!fs.existsSync('./dist')){
	fs.mkdirSync('./dist');
}

fs.readdir('./devtools/', (err, files) => {
	if(err){
		throw err;
	}
	files = files.map(f => new File(f));
	Promise.all(files.map(file => file.copyAndWatch())
	).then(() => {
		webpackWatch();
		serveFiles();
	});
});
