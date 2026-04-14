import express from "express";
import Thread from "../models/Thread.js";
import { gettingFromGemini } from "../utils/Geminiai.js";

const router = express.Router();

router.get("/thread", async (req, res) => {
  try {
    const result = await Thread.find().sort({ updatedAt: -1 });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: `Error during fetching all threads : ${error.message}`,
    });
  }
});

router.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const result = await Thread.findOne({ threadId });
    if (!result) {
      return res.status(404).json({ message: "Thread not found" });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error during fetching a thread : ${error.message}` });
  }
});

router.delete("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const result = await Thread.findOneAndDelete({ threadId });
    if (!result) {
      return res.status(404).json({ message: `Thread not found` });
    }

    return res.status(200).json({ message: `Thread deleted` });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error during deleting a thread : ${error.message}` });
  }
});

router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message) {
    return res
      .status(400)
      .json({ message: `Need required fields from frontend.` });
  }

  try {
    let result = await Thread.findOne({ threadId });
    if (result) {
      result.messages.push({ role: "user", content: message });
    } else {
      result = await Thread.create({
        threadId,
        title: message,
        messages: [{ role: "user", content: message }],
      });
    }

    const AssistentReply = await gettingFromGemini(message);
    result.messages.push({
      role: "assistant",
      content: AssistentReply || "No reply",
    });
    result.updatedAt = new Date();
    await result.save();

    return res.status(200).json({ reply: AssistentReply });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: `Error during chats : ${error.message}` });
  }
});

export default router;
