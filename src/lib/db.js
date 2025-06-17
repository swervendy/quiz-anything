import { MongoClient } from 'mongodb';

let client;
let db;

export async function connectToDB() {
  if (!db) {
    try {
      if (!client) {
        client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
      }
      db = client.db(process.env.MONGODB_DB);
    } catch (error) {
      console.error("Could not connect to the database:", error);
      throw new Error("Database connection failed");
    }
  }
  return db;
}
