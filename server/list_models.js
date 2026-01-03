require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  try {
    // This asks Google to list everything your key has access to
    const modelResponse = await genAI.getGenerativeModel({ model: "gemini-pro" }); 
    // Actually, there is a specific method for listing models in the newer SDK, 
    // but let's try a direct fetch to the API endpoint to be sure.
    
    console.log("Checking API Key permissions...");
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await response.json();

    if (data.error) {
      console.error("❌ API ERROR:", data.error.message);
      console.error("👉 CAUSE:", data.error.status);
    } else {
      console.log("✅ SUCCESS! Here are the models your key can use:");
      console.log(data.models.map(m => m.name));
    }

  } catch (error) {
    console.error("Network Error:", error);
  }
}

listModels();