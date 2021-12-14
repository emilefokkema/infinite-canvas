const { exec } = require('child_process');

module.exports = function(dir){
    console.log(`going to serve files...`)
	var p = exec(`npx http-server ${dir}`, (error, stdout, stderr) => {
		if (error) {
			console.error(`serve files error: ${error}`);
			return;
		}
		console.log(`serve files out: ${stdout}`);
		console.error(`serve files error: ${stderr}`);	
	})
	p.stdout.on('data', (data) => {
		console.log(data);
	});
}