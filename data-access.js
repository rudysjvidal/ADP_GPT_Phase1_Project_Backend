import 'dotenv/config';
import { MongoClient } from 'mongodb';

let client;
let db;
let collection;
let userCollection;


export async function connectToDatabase() {
  const url = process.env.MONGO_DB_URL;
  const dbName = process.env.MONGO_DB;
  const collectionName = process.env.MONGO_DB_COLLECTION;

  if (!url || !dbName || !collectionName) {
    throw new Error("Missing MongoDB environment variables");
  }

  client = new MongoClient(url);

  await client.connect();
  console.log("Connected to MongoDB");

  db = client.db(dbName);
  collection = db.collection(collectionName);
  userCollection = db.collection('users');
}

export function getCollection() {
  if (!collection) {
    throw new Error("MongoDB not connected yet. Call connectToDatabase() first.");
  }
  return collection;
}

export function getUserCollection() {
  if (!userCollection) {
    throw new Error("MongoDB not connected yet. Call connectToDatabase() first.");
  }
  return userCollection;
}

export async function closeConnection() {
  if (client) {
    await client.close();
    console.log("MongoDB connection closed.");
  }
}