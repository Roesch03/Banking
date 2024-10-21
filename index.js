import { createServer } from "http";
import { MongoClient, ServerApiVersion } from "mongodb";
const port = Number(8080);
const mongo_client = await (async () => {
  const mongo_address = process.env.MONGO_ADDRESS || "localhost";
  const uri = `mongodb://${mongo_address}:27017/`;
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  await client.connect();
  return client;
})();

async function accounts() {
  return await mongo_client
    .db("banking")
    .collection("accounts")
    .find()
    .toArray();
}

const server = createServer(async (req, res) => {
  // Parse the request url
  const reqUrl = new URL(
    `${port == 80 ? "http" : "https"}://${process.env.HOST ?? "localhost"}${
      req.url
    }`
  );
  const reqPath = reqUrl.pathname;

  if (reqPath == "/api/accounts") {
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
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
