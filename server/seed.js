const mongoose = require('mongoose');

// Use your exact Mongo URL
const MONGO_URL = "mongodb+srv://admin:***REMOVED***@nishtha.dg0dgkd.mongodb.net/?appName=nishtha"; 

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
  {
    citizenName: "Rajesh Khanna",
    location: "Mumbai, MH",
    description: "Main road in Bandra West has several deep potholes causing traffic jams.",
    category: "Roads",
    priority: "high",
    aiSummary: "Multiple potholes on high-traffic artery require urgent municipal repair.",
    status: "pending"
  },
  {
    citizenName: "Sunita Williams",
    location: "Bangalore, KA",
    description: "Street lights have been non-functional in Indiranagar 4th cross for a week.",
    category: "Electricity",
    priority: "medium",
    aiSummary: "Lighting failure in residential area creating safety concerns.",
    status: "in-progress"
  },
  {
    citizenName: "Amit Shah",
    location: "Delhi, DL",
    description: "Water supply contamination reported in Rohini Sector 8. Water appears brown.",
    category: "Water",
    priority: "critical",
    aiSummary: "Public health risk due to contaminated water supply in residential sector.",
    status: "pending"
  }
];

async function seedDB() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to DB for seeding...");
  await Grievance.deleteMany({}); // Clears old data so it's clean
  await Grievance.insertMany(seedData);
  console.log("Database Seeded Successfully! 10 Grievances Added.");
  process.exit();
}

seedDB();