import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const dataPath = path.resolve("public/questions.json");

app.get("/api/questions", async (req, res) => {
  try {
    const data = await fs.readFile(dataPath, "utf-8");
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: "読み込み失敗" });
  }
});

app.post("/api/questions", async (req, res) => {
  try {
    const newQuestions = req.body;
    await fs.writeFile(dataPath, JSON.stringify(newQuestions, null, 2));
    res.json({ message: "保存成功" });
  } catch (err) {
    res.status(500).json({ error: "保存失敗" });
  }
});

app.listen(port, () => {
  console.log(`✅ サーバー起動: http://localhost:${port}`);
});
