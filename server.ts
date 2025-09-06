import express from "express";
// Make sure the file exists at the specified path, or update the path if necessary
import pdfLanguageRouter from "./src/lib/api/pdfLanguage";

const app = express();
const port = process.env.PORT || 3001;

app.use("/api", pdfLanguageRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
