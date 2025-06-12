import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 5000;

app.use(cors());

app.get("/questions", (req, res) => {
  const filePath = path.join(process.cwd(), "server", "public", "questions.json");
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    res.json(JSON.parse(data));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "ファイル読み込みエラー" });
  }
});

app.listen(PORT, () => {
  console.log(`サーバー起動中: http://localhost:${PORT}`);
});

---

【③ client/src/components/EnglishTrapQuestions.jsx (変更部分のみ)】

useEffect(() => {
  fetch("http://localhost:5000/questions")
    .then((res) => res.json())
    .then((data) => {
      setQuestions(data);
      const allUnits = Array.from(new Set(data.map((q) => q.unit)));
      setUnits(allUnits);
    });
}, []);
