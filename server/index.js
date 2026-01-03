const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// PASTE YOUR MONGO CONNECTION STRING HERE LATER
// mongoose.connect("mongodb+srv://admin:admin123@nishtha.dg0dgkd.mongodb.net/?appName=nishtha");

app.get('/', (req, res) => {
    res.send("Backend is Working!");
});

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});