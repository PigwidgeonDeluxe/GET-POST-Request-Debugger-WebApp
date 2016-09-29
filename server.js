var express = require('express');
var app = express();
var http = require('http');
var fs = require('fs');
app.use(express.static('public'));

//receive any request from anywhere
app.all('*', function(req, res) {
	// get request header as a JSON string, formatted with tabs
  	var requestheaders = JSON.stringify(req.headers, null, "\t")
  	var requestURL = req.url;
	
	//print the request to the console
	console.log("Request recieved. ");
	console.log("Request URL: " + requestURL);
	console.log("Request Headers: " + requestheaders);
	//send the request headers to the user
    res.end("Request URL: " + requestURL + "\n" + "Request Headers: " + requestheaders );
})

//start server at port 8081
var server = app.listen(8081, function() {

    var host = server.address().address
    var port = server.address().port
        //print to console server address and port
    console.log("Server listening at http://%s:%s", host, port)

})