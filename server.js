var express = require('express');

var app = express();

app.use(express.static(__dirname));

var port = process.env.PORT || 9000;

app.listen(port);
console.log('listening on ' + port);