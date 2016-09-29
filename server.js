var express = require('express');
var app = express();
var http = require('http');
var fs = require('fs');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'));
app.use(bodyParser.json());


//(generates logs) - function to write the given response to a specified log
function writetofile(filepath, output) {
    fs.writeFile(filepath, output, function(err) {
        //if theres an error print it to the console
        if (err) {
            return console.log(err);
        } else {
            console.log("Response written to log:", filepath);
        }

    })
}

//function that gets the current date and time
function getdate() {
    var d = new Date();
    var currenttime = d.getFullYear() + "." + ('0' + d.getMonth()).slice(-2) + "." + ('0' + d.getDay()).slice(-2) + "." + ('0' + d.getHours()).slice(-2) + ('0' + d.getMinutes()).slice(-2) + ('0' + d.getSeconds()).slice(-2)
    return currenttime;
}

// function to generate file name with date and time and set file paths
function genfilepath(i, requesttype) {
	//get current filepath of this file
    var filepath = __dirname;
    //get current date and time
    var currenttime = getdate();
    //create the filepath based on current directory
    filepath += "/logs/" + requesttype + "_response_log_" + i + "_" + currenttime + ".txt";
    return filepath;
}

//send html page to user
app.get('/', function(req, res) {
	//snd homepage
    res.sendFile(__dirname + "/" + "homepage.html");
})

//get response from html page
app.post('/process_post', function(req, res) {
    //console.log(req, req.body.loop.amount);
    // put output in JSON format
    response = {
        loop: req.body.loop_query,
        host: req.body.host_query,
        path: req.body.path_query,
        port: req.body.port_query,
        request: req.body.requestpicker,
        key1: req.body.key1_query,
        value1: req.body.value1_query,
        key2: req.body.key2_query,
        value2: req.body.value2_query,
        logsenabled: req.body.logs_query,
        requestbody: req.body.body_query
    };
    //print the given query to theresponse("requestbody") user to signal command was recieved
    var givenquery = [response["request"], response["host"] + ":" + response["port"], response["path"], response["loop"], "time(s) ", "with logs " + response["logsenabled"]].join();
    var diplayquery = "Recieved command: " + givenquery.replace(/,/g, " ");
    res.sendFile(__dirname + "/" + "homepage.html");
    res.end(JSON.stringify(diplayquery));

    //
    var enablelogs = response["logsenabled"];
    //push the given key and values into a array
    var headers = {};
    if (response["key1"] != "") {
        headers[response["key1"]] = response["value1"];
    }
    if (response["key2"] != "") {
        headers[response["key2"]] = response["value2"];
    }

    //GET: the url/address, etc
    var getoptions = {
        host: response["host"],
        path: response["path"],
        port: response["port"],
        //headers: headers
    };

    //POST: the url/addresses, etc
    var postoptions = {
        host: response["host"],
        path: response["path"],
        port: response["port"],
        //headers: headers,
        method: "POST"
    };


    // if the user chose to GET
    if (response["request"] == "GET") {
    	//if there are headers, add headers to options
    	if (response["key1"] != "" || response["key2"] != "") {
        getoptions["headers"] = headers;
    	}
        console.log(getoptions, "logs " + response["logsenabled"]);
        //the loop for get
        for (var i = 0; i < response["loop"]; i++) {
            (function(i) {
                //generate file name with date and time and set file paths
                var filepath = genfilepath(i, response["request"]);
                callback = function(response) {
                        var str = '';

                        //another chunk of data has been recieved, so append it to `str`
                        response.on('data', function(chunk) {
                            str += chunk;
                        });

                        //the whole response has been recieved, write the response to the logs if enabled
                        if (enablelogs == "on") {
                            console.log("Response has been recieved, connection successful");
                            response.on('end', function() {
                                var output = str;
                                writetofile(filepath, output);
                            });
                        }

                    }
                //sending the actual GET request
                http.get(getoptions, callback);
            })(i);

        }
    } //if the user chose to POST
    else if (response["request"] == "POST") {
    	//if there are headers, add headers to options
    	if (response["key1"] != "" || response["key2"] != "") {
        	getoptions["headers"] = headers;
    	}
        console.log(getoptions, "logs " + response["logsenabled"]);
        //the loop for post
        for (var i = 0; i < response["loop"]; i++) {
            (function(i) {
                //generate file name with date and time and set file paths
                var filepath = genfilepath(i, response["request"]);

                callback = function(response) {
                        var str = '';

                        //another chunk of data has been recieved, so append it to `str` until all requests have been recieved
                        response.on('data', function(chunk) {
                            str += chunk;
                            console.log("Response is being read");

                        });

                        //the whole response has been recieved, write the response to the logs if enabled
                        if (enablelogs == "on") {
                            console.log("Response has been recieved, connection successful");
                            response.on('end', function() {
                                var output = str;
                                //write to log file
                                writetofile(filepath, output);
                            });
                        }

                    }
                    //the POST request
                var postrequest = http.request(postoptions, callback);
                //console.log("requestbody: " + typeof(response["requestbody"]));
                //Turn the string request body into a JSON object
                var requestbodyJSON = JSON.parse(response["requestbody"]);
                //console.log("requestbodyJSON: " + typeof(requestbodyJSON));
                //console.log("requestbodyJSON['identifier']['value']:" + requestbodyJSON['identifier'][0]['value']);
                //Get the current date and time
                var d = new Date();
                var currenttime = getdate()
                    //Change the submission ID to the current loop # and the current time and date
                requestbodyJSON['identifier'][0]['value'] += ("_" + i + "_" + currenttime);
                //Turn the request body JSON back into a string
                var finalrequestbody = JSON.stringify(requestbodyJSON);
                //Send the string body as body request
                postrequest.write(finalrequestbody);
                postrequest.end();
            })(i);

        }
    }

})

//start server at port 8081
var server = app.listen(8081, function() {

    var host = server.address().address
    var port = server.address().port
        //print to console server address and port
    console.log("Server listening at http://%s:%s", host, port)

})