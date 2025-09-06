import express from "express";
import pdfLanguageRouter from "./lib/api/pdfLanguage.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use("/api", pdfLanguageRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
