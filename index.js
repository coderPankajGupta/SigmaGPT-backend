import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import Chatrouter from "./routes/Chat.js";

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api", Chatrouter);

app.listen(8080, () => {
  console.log(`Server is running on 8080`);
});
