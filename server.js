var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http');
var fs = require('fs');
app.use(express.static('public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
    extended: true
})); // for parsing application/x-www-form-urlencoded
//get the body chunk by chunk and append to to req.rawBody. copied from http://stackoverflow.com/questions/18710225/node-js-get-raw-request-body-using-express
app.use(function(req, res, next) {
    req.rawBody = '';
    req.setEncoding('utf8');

    req.on('data', function(chunk) {
        req.rawBody += chunk;
    });

    req.on('end', function() {
        next();
    });
});

function generalrequests(){
	
}
//receive GET request from anywhere
app.get('*', function(req, res) {
    // get request header as a JSON string, formatted with tabs
    var requestmethod = req.method;
    var requestURL = req.originalUrl;
    var requestheaders = JSON.stringify(req.headers, null, "\t");
    var requestparams = JSON.stringify(req.params, null, "\t");

    var userresponse = ("Request Method: " + requestmethod + "\n" +
        "Request URL: " + requestURL + "\n" +
        "Request Parameters: " + requestparams + "\n" +
        "Request Headers: " + requestheaders);

    //print the request to the console
    console.log("Request recieved.");
    console.log(userresponse);

    //send the request headers to the user
    res.end(userresponse);
})

//recieve POST request from anywhere
app.post('*', function(req, res) {
    // get request header as a JSON string, formatted with tabs
    var requestmethod = req.method;
    var requestURL = req.originalUrl;
    var requestheaders = JSON.stringify(req.headers, null, "\t");
    var requestparams = JSON.stringify(req.params, null, "\t");
    var requestbody = req.rawBody;

    var userresponse = ("Request Method: " + requestmethod + "\n" +
        "Request URL: " + requestURL + "\n" +
        "Request Parameters: " + requestparams + "\n" +
        "Request Headers: " + requestheaders + "\n" +
        "Request Body: " + requestbody);

    //print the request to the console
    console.log("Request recieved.");
    console.log(userresponse);

    //send the request headers to the user
    res.end(userresponse);
})

//start server at port 8081
var server = app.listen(8081, function() {

    var host = server.address().address
    var port = server.address().port
        //print to console server address and port
    console.log("Server listening at http://%s:%s", host, port)

})