const http = require('http');
const https = require('https');
const fs = require('fs');
const express = require('express');

const index = fs.readFileSync('./index.html', 'utf-8');
const favicon = fs.readFileSync('./favicon.ico');
const schema = fs.readFileSync('./cda_schemas.html', 'utf-8');
// const example = fs.readFileSync('./SampleCDADocument.xml', 'utf-8');
const app = express();

let privateKey; 
let certificate;
let ca;
let credentials;
if  (fs.existsSync('./certs/') && fs.existsSync('./certs/cda-health.key')) {
  privateKey  = fs.readFileSync('./certs/cda-health.key', 'utf-8');
  certificate = fs.readFileSync('./certs/cda-health.crt', 'utf-8');
  ca = fs.readFileSync('./certs/cda-health.ca-bundle', 'utf-8')
  credentials = {key: privateKey, cert: certificate, ca: ca};
}

app.use('/help', express.static('help'));
app.use('/images', express.static('images'));
app.use('/infrastructure', express.static('infrastructure'));
app.use('/processable', express.static('processable'));
app.use('/styles', express.static('styles'));
app.use('/support', express.static('support'));

app.get(['/favicon.ico'], (req, res) => {
  res.send(favicon);
});

app.get(['/cda_schemas.html'], (req, res) => {
  res.send(schema);
});

app.get(['/', '/index.html'], (req, res) => {
    res.send(index);
});


var httpServer = http.createServer(app);
let httpsServer;
if (credentials) {
  httpsServer = https.createServer(credentials, app);
}

httpServer.listen(80);
if (httpsServer) {
  httpsServer.listen(443);
  console.log('listening on HTTP and HTTPS...')
}
else console.log('HTTPS server not running...')