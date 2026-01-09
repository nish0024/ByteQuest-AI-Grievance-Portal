const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: "https://byte-quest-ai-grievance-portal.vercel.app", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// --- CONFIGURATION ---
// We use process.env so your secrets stay safe in Render's settings
const MONGO_URL = process.env.MONGO_URI; 
const GEMINI_KEY = process.env.GEMINI_API_KEY;

if (MONGO_URL) {
  console.log("DB URL detected. Connecting...");
}

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

// --- CONNECT TO DB ---
mongoose.connect(MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// --- THE AI ROUTE ---
app.post('/api/report', async (req, res) => {
  const { citizenName, description } = req.body;

  try {
    const prompt = `
      Analyze this grievance: "${description}".
      Respond ONLY with a JSON object (no markdown) in this format:
      { "category": "category_name", "priority": "High/Medium/Low", "summary": "1-sentence summary" }
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonString = text.replace(/```json|```/g, '').trim(); 
    const aiData = JSON.parse(jsonString);

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

app.get('/api/grievances', async (req, res) => {
  const grievances = await Grievance.find().sort({ createdAt: -1 });
  res.json(grievances);
});

app.get('/api/grievance/:id', async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);
    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found.' });
    }
    res.json(grievance);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid tracking number format.' });
    }
    res.status(500).json({ message: 'Server error.' });
  }
});

// Use Render's assigned port or default to 5000 for local testing
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});