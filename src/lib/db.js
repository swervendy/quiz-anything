import { MongoClient } from 'mongodb';

let client;

export async function connectToDB() {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
  }
  return client.db(process.env.MONGODB_DB);
}
