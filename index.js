const http = require("http");
// Import the URL module
const url = require("url");
const fs = require('node:fs');

const accounts = JSON.parse(fs.readFileSync("data.json"));
// Make our HTTP server
const server = http.createServer((req, res) => {
    // Parse the request url
    const reqUrl = url.parse(req.url).pathname
    if (reqUrl == "/") {
        res.write("Hello")
        res.end()
    }
    else if (reqUrl == "/accounts") {
        res.write(JSON.stringify(accounts))
        res.end()
    }
})
// Have the server listen on port 9000
server.listen(9000)
