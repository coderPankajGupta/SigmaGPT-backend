import dotenv from "dotenv";
dotenv.config();
import express from "express";
import axios from "axios";
import cors from "cors";
import connectDB from "./config/db";

const API_KEY = process.env.GEMINI_API_KEY;

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.post("/test", handleTest);

async function handleTest(req, res) {
  const result = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
    {
      contents: [
        {
          parts: [
            {
              text: req.body.message,
            },
          ],
        },
      ],
    },
  );
  console.log(result.data.candidates[0].content.parts[0].text);
  res.send(result.data.candidates[0].content.parts[0].text);
}

app.listen(8080, () => {
  console.log(`Server is running on 8080`);
});
