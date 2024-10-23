import { createSign, createVerify } from "crypto";
const addresses = ["116.203.93.180", "162.55.191.34"];

function transaction_verify(block, last_block) {
  const v = createVerify("SHA256");
  v.update(block.height.toString());
  v.update(block.from.toString());
  v.update(block.to.toString());
  v.update(block.amount.toString());
  v.update(block.prev_hash.toString());
  const valid_transaction = v.verify(block.from, block.sign);
  const is_next = block.prev_hash == last_block.sign;
  return valid_transaction && is_next;
}

export async function transaction_post(block, client) {
  const last = await client
    .db("banking")
    .collection("transactions")
    .find({})
    .sort({ height: -1 })
    .limit(1);
  if (!transaction_verify(block, last)) return;
  await client.db("banking").collection("transactions").insertOne(block);
}

const hardcoded_json = {};

export async function internal_transaction(block, client) {
  const last = await client
    .db("banking")
    .collection("transactions")
    .find({})
    .sort({ height: -1 })
    .limit(1);
  const s = createSign("SHA256");
  block.height = last.height + 1;
  block.prev_hash = last.sign;
  s.update(block.height.toString());
  s.update(block.from.toString());
  s.update(block.to.toString());
  s.update(block.amount.toString());
  s.update(block.prev_hash.toString());
  block.sign = s.sign(block.private).toString("base64");
  delete block.private;
  for (const address in addresses) {
    const response = await fetch(`http://${address}:3001/api/transaction`, {
      method: "POST",
      body: JSON.stringify(block),
      headers: { "Content-type": "application/json" },
    });
  }
}
