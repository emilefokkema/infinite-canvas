const fs = require("fs");

fs.copyFile("./devtools/index.html", "./dist/index.html", (err) => {
	if (err) throw err;
});