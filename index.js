const http = require("http");
const url = require("url");
const fs = require('node:fs');

const accounts = JSON.parse(fs.readFileSync("data.json"));

const server = http.createServer((req, res) => {
    // Parse the request url
    const reqUrl = url.parse(req.url).pathname;

    if (reqUrl == "/") {
        // Serve the HTML page
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(`
            <!DOCTYPE html>
            <html lang="de">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Kontoübersicht</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 20px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                    }
                    th, td {
                        border: 1px solid #ccc;
                        padding: 10px;
                        text-align: left;
                    }
                    th {
                        background-color: #e2e2e2;
                    }
                    .header {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 20px;
                    }
                    .button {
                        background-color: #6200ea;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        cursor: pointer;
                    }
                    .button:hover {
                        background-color: #3700b3;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Kontoübersicht</h1>
                    <button class="button" onclick="send()">Senden</button>
                </div>
                <table>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Betrag</th>
                    </tr>
                    ${accounts.map(account => `
                        <tr>
                            <td>${account.id}</td>
                            <td>${account.kontoname}</td>
                            <td>$${account.betrag.toFixed(2)}</td>
                        </tr>
                    `).join('')}
                    
                </table>
                <script>
                    function send() {
                        // Add your send logic here
                        alert('Send button clicked!');
                    }
                </script>
            </body>
            </html>
        `);
        res.end();
    } else if (reqUrl == "/accounts") {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(accounts));
        res.end();
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('404 Not Found');
        res.end();
    }
});

// Have the server listen on port 9000
server.listen(9000, () => {
    console.log('Server is listening on port 9000');
});
