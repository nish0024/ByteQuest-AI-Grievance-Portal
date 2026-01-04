const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: "https://byte-quest-ai-grievance-portal.vercel.app", // Your exact Vercel link
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// --- CONFIGURATION ---
// PASTE YOUR MONGO URL HERE
const MONGO_URL = "mongodb+srv://admin:***REMOVED***@nishtha.dg0dgkd.mongodb.net/?appName=nishtha"; 

// PASTE YOUR GEMINI API KEY HERE
const genAI = new GoogleGenerativeAI("AIzaSyArgCIlg-MNNljMe0paqJIrWCWXGcTOTe0");
// NEW (Working):
// This alias is safer because it auto-selects the working version
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
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

// --- CONNECT TO DB ---
mongoose.connect(MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// --- THE AI ROUTE ---
app.post('/api/report', async (req, res) => {
  const { citizenName, description } = req.body;

  try {
    // 1. Ask AI to analyze the complaint
    const prompt = `
      Analyze this grievance: "${description}".
      Respond ONLY with a JSON object (no markdown) in this format:
      { "category": "category_name", "priority": "High/Medium/Low", "summary": "1-sentence summary" }
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up AI text to ensure it's valid JSON
    const jsonString = text.replace(/```json|```/g, '').trim(); 
    const aiData = JSON.parse(jsonString);

    // 2. Save to Database
    const newGrievance = new Grievance({
      citizenName,
      description,
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

// --- GET ALL GRIEVANCES (For Admin Dashboard) ---
app.get('/api/grievances', async (req, res) => {
  const grievances = await Grievance.find().sort({ createdAt: -1 });
  res.json(grievances);
});

// --- GET SINGLE GRIEVANCE BY ID (For Tracking) ---
app.get('/api/grievance/:id', async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);
    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found. Please check your tracking number.' });
    }
    res.json(grievance);
  } catch (error) {
    // Handle invalid ObjectId format
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid tracking number format.' });
    }
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});
