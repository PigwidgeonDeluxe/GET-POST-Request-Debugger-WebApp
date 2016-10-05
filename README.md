#GET/POST-Request-Debugger-WebApp
Simple node.js webapp that prints the GET or POST request that it receives for debugging purposes. If a GET request is received, it returns request method, url, parameters, and headers. If a POST request is received, it returns all of the above including the request body. The responses are in JSON format.

Requirements

- node.js
- the github files
- express (in node_modules folder)
- bodyparser (in node_modules folder)

Installation

1. Create a directory named requestdebugger_app
2. Download all files to the folder.
3. Extract the node_modules.zip to a folder called node_modules in the same directory as server.js
4. Run the webapp using node server.js. Server will run on localhost:8081.
