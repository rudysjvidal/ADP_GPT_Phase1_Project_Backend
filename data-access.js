require('dotenv').config();
const { MongoClient } = require('mongodb');

let client;
let db;
let collection;


async function connectToDatabase() {
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
}


function getCollection() {
  if (!collection) {
    throw new Error("MongoDB not connected yet. Call connectToDatabase() first.");
  }
  return collection;
}


async function closeConnection() {
  if (client) {
    await client.close();
    console.log("🔌 MongoDB connection closed.");
  }
}

module.exports = {
  connectToDatabase,
  getCollection,
  closeConnection
};
