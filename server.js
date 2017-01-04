//jshint esversion: 6

const http = require('http');
const fs = require('fs');
const PORT = process.env.PORT || 3000;
const qs = require('querystring');

let path = './public';

const fileNotFoundErrorHandler = (res) => {
  res.statusCode = 500;
  res.end('Server is broken');
};

const sendContent = (res, content) => {
  res.setHeader('Content-Type', 'text/plain');
  res.write(content);
  res.end();
};

//must call file with extension (i.e. index.html)
const server = http.createServer( (req, res) => {
	console.log("reqURL", req.url);
	console.log("req.method", req.method);
	console.log("req.headers", req.headers);

	let reqBody = '';
	req.setEncoding('utf8');
	req.on('data', (chunk) => {
		reqBody += chunk;
	});
	req.on('end', () => {
		let bodyQS = qs.parse(reqBody);
		let splitBody = bodyQS.elementName;
			fs.writeFile(`./public/${bodyQS.elementName.toLowerCase()}.html`,
`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>The Elements - Hydrogen</title>
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
  <h1>${bodyQS.elementName}</h1>
  <h2>${bodyQS.elementSymbol}</h2>
  <h3>${bodyQS.elementAtomicNumber}</h3>
  <p>${bodyQS.elementDescription}</p>
  <p><a href="/">back</a></p>
</body>
</html>`,
					'utf8', (err) => {
			if (err) throw err;
			console.log('Saved to public directory');
			});
		console.log(bodyQS);
		console.log(bodyQS.elementName.toLowerCase());

//use this instead of resourceMapping
fs.readdir(path, function (err, files){
	if (err) {
		throw err;
	}
	fs.readFile("./public/"+files[files.indexOf(req.url.substr(1))] || '', (err, content) => {
		if(err){
			res.statusCode = 500;
			res.write("server fault occured");
			res.end();
			return;
		}
		res.setHeader('Content-Type', 'text/html');
		res.write(content);
		res.end();
	});
});
	});

});

server.listen(PORT, () => {
	console.log('server is listening on port', PORT);
});