// --- 3. ROBUST CONNECTION LOGIC ---
const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from Environment Variables");
    }

    console.log("Attempting to connect to MongoDB Atlas...");
    
    // serverSelectionTimeoutMS: 5000 helps identify IP whitelist issues faster
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000 
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