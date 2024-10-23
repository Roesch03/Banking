import { createServer } from "http";
import { MongoClient, ServerApiVersion } from "mongodb";
import { transaction_post, internal_transaction } from "./transaction_rec.js";

const port = Number(3001);
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

async function transactions() {
  return await mongo_client
    .db("banking")
    .collection("transactions")
    .find()
    .sort({ height: 1 })
    .toArray();
}

async function id_exists(id) {
  return (
    (await mongo_client
      .db("banking")
      .collection("accounts")
      .countDocuments({ id: id })) > 0
  );
}

async function transaction(from, to, amount) {
  const accounts = mongo_client.db("banking").collection("accounts");
  await accounts.updateOne({ id: from }, { $inc: { betrag: -amount } });
  await accounts.updateOne({ id: to }, { $inc: { betrag: amount } });
  await mongo_client
    .db("banking")
    .collection("transactions")
    .insertOne({ from: from, to: to, amount: amount });
}

const server = createServer(async (req, res) => {
  // Parse the request url
  const reqUrl = new URL(
    `${port == 80 ? "http" : "https"}://${process.env.HOST ?? "localhost"}${
      req.url
    }`
  );
  const reqPath = reqUrl.pathname;

  if (reqPath == "transactions") {
    if (req.method == "POST") {
      var body = "";

      req.on("data", function (data) {
        body += data;

        // Too much POST data, kill the connection!
        // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
        if (body.length > 1e6) req.connection.destroy();
      });

      req.on("end", async function () {
        const trans = JSON.parse(body);
        await transaction_post(trans, mongo_client);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end();
      });
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify(await transactions()));
      res.end();
    }
  } else if (reqPath == "/api/accounts") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify(await accounts()));
    res.end();
  } else if (reqPath == "/api/transaction" && req.method === "POST") {
    var body = "";

    req.on("data", function (data) {
      body += data;

      // Too much POST data, kill the connection!
      // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
      if (body.length > 1e6) req.connection.destroy();
    });

    req.on("end", async function () {
      const trans = JSON.parse(body);
      await internal_transaction(trans);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ success: true }));
      res.end();
    });
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
