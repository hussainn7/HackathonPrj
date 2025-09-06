// Set the workerSrc for pdfjs-dist
import { GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf.mjs";
try {
  GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
  console.log('[PDFLanguageDetector] Set pdfjs workerSrc to /pdf.worker.min.js');
  // Test if worker file is accessible
  fetch('/pdf.worker.min.js')
    .then(res => {
      if (res.ok) {
        console.log('[PDFLanguageDetector] Worker file is accessible.');
      } else {
        console.error('[PDFLanguageDetector] Worker file is NOT accessible. Status:', res.status);
      }
    })
    .catch(err => {
      console.error('[PDFLanguageDetector] Error fetching worker file:', err);
    });
} catch (err) {
  console.error('[PDFLanguageDetector] Error setting workerSrc:', err);
}
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Ensure pdfjs-dist is installed: npm install pdfjs-dist
// If using TypeScript, you may need: npm install --save-dev @types/pdfjs-dist (if available)
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
// If you encounter issues, use dynamic import:
// const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');

const PDFLanguageDetector: React.FC = () => {
  const [pdfText, setPdfText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | {
    transcript?: string;
    detected_language?: string;
    iso_code?: string;
    translation_to_english?: string;
    language?: string;
    isoCode?: string;
    translation?: string;
  }>(null);
  const [error, setError] = useState("");
  const [showLanguageSelection, setShowLanguageSelection] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);

  const languages = [
    { code: "English", name: "English" },
    { code: "Spanish", name: "Spanish (Español)" },
    { code: "French", name: "French (Français)" },
    { code: "German", name: "German (Deutsch)" },
    { code: "Italian", name: "Italian (Italiano)" },
    { code: "Portuguese", name: "Portuguese (Português)" },
    { code: "Russian", name: "Russian (Русский)" },
    { code: "Chinese", name: "Chinese (中文)" },
    { code: "Japanese", name: "Japanese (日本語)" },
    { code: "Korean", name: "Korean (한국어)" },
    { code: "Arabic", name: "Arabic (العربية)" },
    { code: "Hindi", name: "Hindi (हिन्दी)" },
    { code: "Dutch", name: "Dutch (Nederlands)" },
    { code: "Swedish", name: "Swedish (Svenska)" },
    { code: "Norwegian", name: "Norwegian (Norsk)" },
    { code: "Danish", name: "Danish (Dansk)" },
    { code: "Finnish", name: "Finnish (Suomi)" },
    { code: "Greek", name: "Greek (Ελληνικά)" },
    { code: "Turkish", name: "Turkish (Türkçe)" },
    { code: "Polish", name: "Polish (Polski)" }
  ];

  const handleFile = async (file: File) => {
    console.log("[PDFLanguageDetector] File selected:", file);
    setLoading(true);
    setError("");
    setResult(null);
    try {
      // Send file to backend as FormData
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
      const formData = new FormData();
      formData.append("file", file);
      console.log(`[PDFLanguageDetector] Uploading file to backend: ${backendUrl}/api/pdf-language`);
      const res = await fetch(`${backendUrl}/api/pdf-language`, {
        method: "POST",
        body: formData,
      });
      console.log("[PDFLanguageDetector] API response status:", res.status);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "API error");
      }
      let data;
      try {
        data = await res.json();
        console.log("[PDFLanguageDetector] API response JSON:", data);
        setResult(data);
        // Show language selection after successful transcript generation
        if (data.transcript) {
          setShowLanguageSelection(true);
        }
      } catch (e) {
        // If response is not valid JSON, show raw text from backend (Gemini output)
        const text = await res.text();
        console.log("[PDFLanguageDetector] API response text:", text);
        setResult({ translation: text, language: "", isoCode: "" });
        setLoading(false);
        return;
      }
      console.log("[PDFLanguageDetector] Result state updated");
    } catch (e: any) {
      console.error("[PDFLanguageDetector] Error:", e);
      setError(e.message || "Failed to process PDF");
      console.log("[PDFLanguageDetector] Error state updated");
    } finally {
      setLoading(false);
      console.log("[PDFLanguageDetector] Processing complete. Loading state set to false.");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log("[PDFLanguageDetector] File dropped:", e.dataTransfer.files[0]);
    if (e.dataTransfer.files.length) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      console.log("[PDFLanguageDetector] File input changed:", e.target.files[0]);
      handleFile(e.target.files[0]);
    }
  };

  const generateSummary = async () => {
    if (!selectedLanguage || !result?.transcript) {
      setError("Please select a language and ensure transcript is available");
      return;
    }

    // Check if selected language matches the detected language
    const detectedLang = result.detected_language || result.language || "";
    const isOriginalLanguage = selectedLanguage.toLowerCase() === detectedLang.toLowerCase() || 
                              (selectedLanguage === "English" && result.translation_to_english);

    // If it's the same language as original, use existing content
    if (isOriginalLanguage && selectedLanguage === "English" && result.translation_to_english) {
      setSummary(`Original content in English:\n\n${result.translation_to_english}\n\nFull transcript:\n${result.transcript}`);
      return;
    } else if (isOriginalLanguage && selectedLanguage !== "English") {
      setSummary(`Original content in ${detectedLang}:\n\n${result.transcript}`);
      return;
    }

    setSummaryLoading(true);
    setError("");
    
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
      const response = await fetch(`${backendUrl}/api/generate-summary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transcript: result.transcript,
          language: selectedLanguage,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to generate summary");
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (e: any) {
      console.error("[PDFLanguageDetector] Summary generation error:", e);
      setError(e.message || "Failed to generate summary");
    } finally {
      setSummaryLoading(false);
    }
  };

  console.log("[PDFLanguageDetector] Rendered PDFLanguageDetector component");
  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">PDF Language Detector</h2>
      <div
        className="border-2 border-dashed border-gray-400 rounded p-6 mb-4 text-center cursor-pointer"
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
      >
        Drag & drop a PDF here
      </div>
      <input type="file" accept="application/pdf" onChange={handleInput} className="mb-4" />
      {loading && <div className="text-blue-500">Processing...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {result && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <div><strong>Detected Language:</strong> {result.detected_language || result.language || ""}</div>
          <div><strong>ISO Code:</strong> {result.iso_code || result.isoCode || ""}</div>
          <div><strong>English Translation:</strong> {result.translation_to_english || result.translation || ""}</div>
          
          {result.transcript && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Full Transcript:</h3>
              <div className="max-h-40 overflow-y-auto bg-white p-3 border rounded text-sm">
                {result.transcript}
              </div>
            </div>
          )}
        </div>
      )}

      {showLanguageSelection && !summary && (
        <div className="mt-6 p-4 border rounded bg-blue-50">
          <h3 className="text-lg font-semibold mb-3">Choose Summary Language</h3>
          <p className="text-sm text-gray-600 mb-4">
            What language would you like the summary to be generated in?
          </p>
          
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          >
            <option value="">Select a language...</option>
            {languages.map((lang) => {
              const isDetectedLang = lang.code.toLowerCase() === (result?.detected_language || "").toLowerCase();
              return (
                <option key={lang.code} value={lang.code}>
                  {lang.name} {isDetectedLang ? "(Original)" : ""}
                </option>
              );
            })}
          </select>

          <button
            onClick={generateSummary}
            disabled={!selectedLanguage || summaryLoading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {summaryLoading ? "Generating Summary..." : 
             (selectedLanguage && (selectedLanguage.toLowerCase() === (result?.detected_language || "").toLowerCase() || 
              (selectedLanguage === "English" && result?.translation_to_english))) ? 
             "Show Original Content" : "Generate Summary"}
          </button>
        </div>
      )}

      {summary && (
        <div className="mt-6 p-4 border rounded bg-green-50">
          <h3 className="text-lg font-semibold mb-3">
            Summary in {selectedLanguage}
          </h3>
          <div className="bg-white p-4 border rounded">
            <div className="whitespace-pre-wrap">{summary}</div>
          </div>
          
          <button
            onClick={() => {
              setSummary("");
              setSelectedLanguage("");
              setShowLanguageSelection(true);
            }}
            className="mt-3 bg-gray-500 text-white py-1 px-3 rounded hover:bg-gray-600 text-sm"
          >
            Generate in Different Language
          </button>
        </div>
      )}
    </div>
  );
};

export default PDFLanguageDetector;
