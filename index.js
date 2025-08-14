import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { ObjectId } from 'mongodb';
import { connectToDatabase, getCollection, getUserCollection } from './data-access.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

let customers, users;


connectToDatabase()
  .then(() => {
    customers = getCollection();
    users = getUserCollection();

    // GET
    app.get('/customers', async (req, res) => {
      const data = await customers.find({}).toArray();
      res.json(data);
    });

    app.get('/users', async (req, res) => {
      const data = await users.find({}).toArray();
      res.json(data);
    });

    // POST
    app.post('/customers', async (req, res) => {
      const result = await customers.insertOne(req.body);
      res.status(201).json({ ...req.body, _id: result.insertedId });
    });

    // PATCH
app.patch('/customers/:id', async (req, res) => {
    const { id } = req.params;
  
    const { _id, ...updates } = req.body;
  
    const result = await customers.updateOne(
      { id: Number(id) },
      { $set: updates }
    );
  
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
  
    res.json({ updated: true });
  });
  
    
    // DELETE
    app.delete('/customers/:id', async (req, res) => {
        const { id } = req.params;
        const result = await customers.deleteOne({ id: Number(id) });
        if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Customer not found' });
        }
        res.json({ deleted: true });
    });
  

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });
