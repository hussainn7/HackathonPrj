import axios from "axios";

export async function detectAndTranslate(text: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
  const prompt = `Detect the language of the following text and provide its ISO code. Then translate it to English. Respond in JSON: {language, isoCode, translation}.\nText: ${text}`;
  const res = await axios.post(endpoint + `?key=${apiKey}`,
    {
      contents: [{ parts: [{ text: prompt }] }],
    }
  );
  const match = res.data?.candidates?.[0]?.content?.parts?.[0]?.text?.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Invalid Gemini response");
  return JSON.parse(match[0]);
}
