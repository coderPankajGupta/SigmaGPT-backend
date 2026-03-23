import dotenv from "dotenv";
dotenv.config();
import axios from "axios";

const API_KEY = process.env.GEMINI_API_KEY;

export async function gettingFromGemini(message) {
  try {
    const result = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: message }],
          },
        ],
      },
    );

    const text = result?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error("No response from gemini");
    }

    return text;
  } catch (error) {
    console.log(`Error during getting message from gemini : ${error.message}`);
  }
}
