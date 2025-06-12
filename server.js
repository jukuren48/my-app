import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API: questions.json を読み取る
app.get("/api/questions", async (req, res) => {
  try {
    const data = await fs.readFile(
      path.join(__dirname, "public", "questions.json"),
      "utf-8"
    );
    const questions = JSON.parse(data);
    res.json(questions);
  } catch (err) {
    console.error("読み込みエラー:", err);
    res.status(500).json({ message: "サーバーエラー" });
  }
});

// API: 新しい問題データを保存する
app.post("/api/questions", async (req, res) => {
  try {
    const newQuestions = req.body;
    await fs.writeFile(
      path.join(__dirname, "public", "questions.json"),
      JSON.stringify(newQuestions, null, 2)
    );
    res.json({ message: "保存完了！" });
  } catch (err) {
    console.error("保存エラー:", err);
    res.status(500).json({ message: "保存失敗" });
  }
});

app.listen(PORT, () => {
  console.log(`APIサーバー起動中: http://localhost:${PORT}`);
});
