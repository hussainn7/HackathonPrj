import express from "express";
import bodyParser from "body-parser";
import { detectAndTranslate } from "../gemini.js";

const router = express.Router();
router.use(bodyParser.json());

router.post("/pdf-language", async (req, res) => {
  console.log("[POST /pdf-language] Incoming request");
  const { text } = req.body;
  console.log("[POST /pdf-language] Request body:", req.body);
  if (!text) {
    console.log("[POST /pdf-language] Missing text in request body");
    res.status(400).json({ error: "Missing text" });
    return;
  }
  try {
    console.log("[POST /pdf-language] Calling detectAndTranslate with text length:", text.length);
    const result = await detectAndTranslate(text);
    console.log("[POST /pdf-language] Gemini result:", result);
    res.json(result);
  } catch (e) {
    console.error("[POST /pdf-language] Error from Gemini or handler:", e);
    res.status(500).json({ error: "Gemini API error" });
  }
});

export default router;
