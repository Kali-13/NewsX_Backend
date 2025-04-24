import dotenv from "dotenv";
import express from "express";

dotenv.config();

import cors from "cors";
import bodyParser from "body-parser";

import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  maxOutputTokens: 1024,
  safetySettings: [
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_NONE",
    },
    {
      category: "HARM_CATEGORY_HATE_SPEECH",
      threshold: "BLOCK_NONE",
    },
    {
      category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold: "BLOCK_NONE",
    },
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "BLOCK_NONE",
    },
  ],
});

app.get("/", (req, res) => {
  res.json({ desc: "Hello World! " });
});
app.post("/generate", async (req, res) => {
  // console.log(req.body);
  var url = req.body.url;

  var prompt = `Give a short summary of news article from this url:${url} in 200-250 words`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  res.json({ desc: response });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
