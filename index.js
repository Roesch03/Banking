import { createServer } from "http";
import { parse } from "url";
import { readFileSync } from "node:fs";
import { MongoClient, ServerApiVersion } from "mongodb";

async function accounts() {
  const mongo_address = process.env.MONGO_ADDRESS || "localhost";
  // mongodb://localhost:27017
  const uri = `mongodb://${mongo_address}:27017/`;
  // Create a MongoClient with a MongoClientOptions object to set the Stable API version
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  await client.connect();
  // Send a ping to confirm a successful connection
  const res = await client
    .db("banking")
    .collection("accounts")
    .find()
    .toArray();
  // Ensures that the client will close when you finish/error
  await client.close();
  return res;
}

const server = createServer(async (req, res) => {
  // Parse the request url
  const reqUrl = parse(req.url).pathname;

  if (reqUrl == "/api/accounts") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify(await accounts()));
    res.end();
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.write("404 Not Found");
    res.end();
  }
});

// Have the server listen on port 80
server.listen(8080, () => {
  console.log("Server is listening on port 80");
});
