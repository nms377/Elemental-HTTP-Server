//jshint esversion: 6

const http = require('http');
const fs = require('fs');
const PORT = process.env.PORT || 3000;
const qs = require('querystring');

const fileNotFoundErrorHandler = (res) => {
  res.statusCode = 500;
  res.end('Server is broken');
};

const sendContent = (res, content) => {
  res.setHeader('Content-Type', 'text/plain');
  res.write(content);
  res.end();
};

const resourceMapping = {
  '/' : './public/index.html',
  '/hydrogen' : './public/hydrogen.html',
  '/helium' : './public/helium.html',
  '/404' : './public/404.html',
  '/styles' : './public/css/styles.css',
};

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
		console.log('reqBody',reqBody);
		let bodyQS = qs.parse(reqBody);
		console.log('bodyQS', bodyQS);

if(resourceMapping.hasOwnProperty(req.url) ){
	fs.readFile(resourceMapping[req.url] || '', (err, content) =>{
		if(err){
			res.statusCode = 404;
			res.write('Resource not found');
			return;
		}
		sendContent(res, content);
	});
}
		console.log(reqBody);
	});

});

server.listen(PORT, () => {
	console.log('server is listening on port', PORT);
});