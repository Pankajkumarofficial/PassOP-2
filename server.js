// Import necessary modules and configure your app
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import path from 'path';
import { fileURLToPath } from 'url'; // import fileURLToPath

const __filename = fileURLToPath(import.meta.url); // Get current filename
const __dirname = path.dirname(__filename); // Get current dirname

const app = express();
const port = 8000;

dotenv.config();

const url = "mongodb+srv://pankajkumar:Pankaj7266@cluster0.vmdbmv2.mongodb.net/";
const client = new MongoClient(url);
const dbName = 'passop';

client.connect();

app.use(bodyParser.json());
app.use(cors());

app.use(express.static(path.join(__dirname, './client/dist'))); // Use __dirname

// Get all passwords
app.get('/api/passwords', async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.find({}).toArray();
    res.json(findResult);
});

// Save a password
app.post('/api/passwords', async (req, res) => {
    const password = req.body;
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    // Remove the _id field from the document
    delete password._id;
    const findResult = await collection.insertOne(password);
    res.send({ success: true, result: findResult });
});


// Delete password
app.delete('/api/passwords', async (req, res) => {
    const password = req.body;
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.deleteOne(password);
    res.send({ success: true, result: findResult });
});

// app.get('*', function (res, req) {
//     res.sendFile(path.join(__dirname, './client/dist/index.html'));
// })

app.use(
    cors({
        "origin": "*"
    })
)

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});
