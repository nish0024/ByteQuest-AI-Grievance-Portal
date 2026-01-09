// --- 3. ROBUST CONNECTION LOGIC ---
const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from Environment Variables");
    }

    console.log("Attempting to connect to MongoDB Atlas...");
    
    // serverSelectionTimeoutMS: 5000 helps identify IP whitelist issues faster
   // Change this line in your startServer function
await mongoose.connect(process.env.MONGO_URI, { 
  serverSelectionTimeoutMS: 5000 
}).catch(err => {
  console.error("DETAILED CONNECTION ERROR:", err.message);
  throw err; 
});
    
    console.log("✅ MongoDB Connected Successfully");

    // Render automatically assigns a PORT; 10000 is a common default
    const PORT = process.env.PORT || 10000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Startup Error:", err.message);
    // Exiting with code 1 tells Render the service is unhealthy so it can retry
    process.exit(1); 
  }
};

startServer();

// Add this to your Backend index.js
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