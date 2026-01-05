const mongoose = require('mongoose');

// Your MongoDB URL
const MONGO_URL = "process.env.mongodb+srv://admin:n8oVx0ZCSLtANguO@nishtha.dg0dgkd.mongodb.net/?appName=nishtha"; 

const GrievanceSchema = new mongoose.Schema({
  citizenName: String,
  location: String,
  description: String,
  category: String,
  priority: String,
  aiSummary: String,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const Grievance = mongoose.model('Grievance', GrievanceSchema);

const seedData = [
  { citizenName: "Nishtha Lalwani", location: "Mumbai, MH", description: "Massive potholes on the main road near Bandra station.", category: "Roads", priority: "high", aiSummary: "Major infrastructure damage affecting transit safety.", status: "pending" },
  { citizenName: "Srijan Sharma", location: "Delhi, DL", description: "Street lights have been off for 3 nights in Rohini Sector 7.", category: "Electricity", priority: "medium", aiSummary: "Safety concern due to lighting failure in residential area.", status: "in-progress" },
  { citizenName: "Ruhani Grover", location: "Bangalore, KA", description: "Water supply is contaminated and smells of chlorine in Indiranagar.", category: "Water", priority: "critical", aiSummary: "Public health risk from suspected water contamination.", status: "pending" },
  { citizenName: "Priya Das", location: "Kolkata, WB", description: "Garbage collection hasn't happened in 5 days on Park Street.", category: "Sanitation", priority: "high", aiSummary: "Sanitation hazard in high-traffic commercial zone.", status: "resolved" },
  { citizenName: "Siddharth Rao", location: "Hyderabad, TS", description: "Illegal construction blocking the fire exit of an apartment.", category: "Public Safety", priority: "critical", aiSummary: "Life-safety violation regarding emergency exit access.", status: "in-progress" },
  { citizenName: "Ananya Mehra", location: "Chennai, TN", description: "Broken drainage pipe causing flooding in T-Nagar.", category: "Sanitation", priority: "high", aiSummary: "Drainage failure leading to localized flooding.", status: "pending" },
  { citizenName: "Rohan Varma", location: "Pune, MH", description: "Public park swings are broken and dangerous for kids.", category: "Municipal", priority: "low", aiSummary: "Maintenance required for recreational equipment.", status: "resolved" },
  { citizenName: "Nishtha Lalwani", location: "Kochi, KL", description: "Noise pollution from late-night speakers at a local event.", category: "Public Safety", priority: "low", aiSummary: "Disturbance of peace in residential locality.", status: "pending" },
  { citizenName: "Aditya Joshi", location: "Ahmedabad, GJ", description: "Frequent power cuts during exam season in Satellite area.", category: "Electricity", priority: "high", aiSummary: "Power instability impacting student productivity.", status: "in-progress" },
  { citizenName: "Sanya Khan", location: "Lucknow, UP", description: "Unauthorized vendors blocking pedestrian footpaths.", category: "Roads", priority: "medium", aiSummary: "Encroachment of public walkway causing traffic issues.", status: "resolved" }
];

async function seedDB() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB for seeding...");
    
    // Deletes old data so you don't get duplicates
    await Grievance.deleteMany({}); 
    
    await Grievance.insertMany(seedData);
    console.log("✅ Success: 10 Grievances Seeded!");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding Error:", err);
    process.exit(1);
  }
}

seedDB();