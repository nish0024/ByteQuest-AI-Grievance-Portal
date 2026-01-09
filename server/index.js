const express = require('express');
const mongoose = require('mongoose'); // <--- CRITICAL: Do not remove this
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
app.use(express.json());

// 1. CORS Setup
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    // Check if the origin contains "vercel.app" or is "localhost"
    const allowedPatterns = [/vercel\.app$/, /localhost:5173$/];
    const isAllowed = allowedPatterns.some(pattern => pattern.test(origin));

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  credentials: true
}));
// 2. Schema and Model
const GrievanceSchema = new mongoose.Schema({
  citizenName: String,
  description: String,
  category: String,
  priority: String,
  aiSummary: String,
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});
const Grievance = mongoose.model('Grievance', GrievanceSchema);

// 3. Routes (Define these BEFORE startServer)
app.get('/api/grievances', async (req, res) => {
  try {
    const grievances = await Grievance.find().sort({ createdAt: -1 });
    res.json(grievances);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
});

app.patch('/api/grievance/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Grievance.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Update failed" });
  }
});

// 4. Robust Connection Logic
const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from Environment Variables");
    }

    console.log("Attempting to connect to MongoDB Atlas...");
    
    await mongoose.connect(process.env.MONGO_URI, { 
      serverSelectionTimeoutMS: 5000 
    });
    
    console.log("✅ MongoDB Connected Successfully");

    const PORT = process.env.PORT || 10000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Startup Error:", err.message);
    process.exit(1); 
  }
};

startServer();