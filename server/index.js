// ... (Your imports remain the same)

const app = express();
app.use(express.json());

// 1. Enhanced CORS (Handling both production and local dev)
const allowedOrigins = [
  "https://byte-quest-ai-grievance-portal.vercel.app",
  "http://localhost:5173", // Vite default
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

// 2. Health Check (Crucial for Render monitoring)
app.get('/health', (req, res) => res.status(200).json({ status: "ok" }));

// ... (Your Schema and AI Model setup remain the same)

// 3. Robust Connection Logic
const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from Environment Variables");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    const PORT = process.env.PORT || 10000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Startup Error:", err.message);
    process.exit(1); // Exit if we can't connect
  }
};

startServer();