require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testConnection() {
  console.log("--- STARTING AI TEST ---");
  
  // 1. Check API Key
  if (!process.env.GEMINI_API_KEY) {
    console.error("❌ CRITICAL: GEMINI_API_KEY is missing in .env file");
    return;
  }
  console.log("✅ API Key loaded (starts with):", process.env.GEMINI_API_KEY.substring(0, 5) + "...");

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  // 2. Try Model A: gemini-1.5-flash
  try {
    console.log("\n👉 Attempting Model: 'gemini-1.5-flash'...");
    const modelA = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const resultA = await modelA.generateContent("Test. Respond with 'OK'.");
    const responseA = await resultA.response;
    console.log("✅ SUCCESS with gemini-1.5-flash! Response:", responseA.text());
    return; // Exit if successful
  } catch (error) {
    console.error("❌ Failed with gemini-1.5-flash:", error.message);
  }

  // 3. Try Model B: gemini-pro (Backup)
  try {
    console.log("\n👉 Attempting Model: 'gemini-pro'...");
    const modelB = genAI.getGenerativeModel({ model: "gemini-pro" });
    const resultB = await modelB.generateContent("Test. Respond with 'OK'.");
    const responseB = await resultB.response;
    console.log("✅ SUCCESS with gemini-pro! Response:", responseB.text());
  } catch (error) {
    console.error("❌ Failed with gemini-pro:", error.message);
  }
}

testConnection();