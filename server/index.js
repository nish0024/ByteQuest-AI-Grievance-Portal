const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
app.use(express.json());

// 1. Enhanced CORS
const allowedOrigins = [
  "https://byte-quest-ai-grievance-portal.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// 2. Health Check
app.get('/health', (req, res) => res.status(200).json({ status: "ok" }));

// --- AI & SCHEMA SETUP ---
const MONGO_URL = process.env.MONGO_URI;
const GEMINI_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

// --- ROUTES ---
app.post('/api/report', async (req, res) => {
  const { citizenName, description } = req.body;
  try {
    const prompt = `Analyze this grievance: "${description}". Respond ONLY with a JSON object (no markdown): { "category": "category_name", "priority": "High/Medium/Low", "summary": "1-sentence summary" }`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json|```/g, '').trim(); 
    const aiData = JSON.parse(text);

    const newGrievance = new Grievance({
      citizenName, description,
      category: aiData.category,
      priority: aiData.priority,
      aiSummary: aiData.summary
    });
    await newGrievance.save();
    res.json({ message: "Grievance Filed!", data: newGrievance });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "Failed to process grievance" });
  }
});

app.get('/api/grievances', async (req, res) => {
  try {
    const grievances = await Grievance.find().sort({ createdAt: -1 });
    res.json(grievances);
  } catch (err) {
    res.status(500).json({ error: "Database fetch failed" });
  }
});

// --- 3. ROBUST CONNECTION LOGIC ---
const startServer = async () => {
  try {
    if (!MONGO_URL) {
      throw new Error("MONGO_URI is missing from Environment Variables");
    }

    console.log("Attempting to connect to MongoDB...");
    // serverSelectionTimeoutMS: 5000 makes it fail fast if IP isn't whitelisted
    await mongoose.connect(MONGO_URL, {
      serverSelectionTimeoutMS: 5000 
    });
    
    console.log("✅ MongoDB Connected Successfully");

    const PORT = process.env.PORT || 10000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Startup Error:", err.message);
    // On Render, we want to see the error in logs, then exit so Render restarts the pod
    process.exit(1); 
  }
};

startServer();