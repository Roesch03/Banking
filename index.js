import { createServer } from "http";
import { parse } from "url";
import { readFileSync } from "node:fs";

const accounts = JSON.parse(readFileSync("data.json"));

const server = createServer((req, res) => {
  // Parse the request url
  const reqUrl = parse(req.url).pathname;

  if (reqUrl == "/") {
    // Serve the HTML page
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(readFileSync("index.html"));
    res.end();
  } else if (reqUrl == "/dev/index.html" || reqUrl == "/dev/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(readFileSync("dev/index.html"));
    res.end();
  } else if (reqUrl == "/accounts") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify(accounts));
    res.end();
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.write("404 Not Found");
    res.end();
  }
});

// Have the server listen on port 80
server.listen(80, () => {
  console.log("Server is listening on port 80");
});
