import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const filePath = path.join(process.cwd(), "questions.json");

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const data = await fs.readFile(filePath, "utf-8");
      res.status(200).json(JSON.parse(data));
    } catch (err) {
      res.status(500).json({ error: "読み込みエラー" });
    }
  }

  if (req.method === "POST") {
    try {
      const newQuestion = req.body;
      const data = await fs.readFile(filePath, "utf-8");
      const questions = JSON.parse(data);
      newQuestion.id = nanoid();
      questions.push(newQuestion);
      await fs.writeFile(filePath, JSON.stringify(questions, null, 2));
      res.status(201).json(newQuestion);
    } catch (err) {
      res.status(500).json({ error: "書き込みエラー" });
    }
  }

  if (req.method === "PUT") {
    try {
      const updatedQuestion = req.body;
      const data = await fs.readFile(filePath, "utf-8");
      let questions = JSON.parse(data);
      questions = questions.map((q) =>
        q.id === updatedQuestion.id ? updatedQuestion : q
      );
      await fs.writeFile(filePath, JSON.stringify(questions, null, 2));
      res.status(200).json(updatedQuestion);
    } catch (err) {
      res.status(500).json({ error: "更新エラー" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const id = req.query.id;
      const data = await fs.readFile(filePath, "utf-8");
      const questions = JSON.parse(data);
      const filtered = questions.filter((q) => q.id !== id);
      await fs.writeFile(filePath, JSON.stringify(filtered, null, 2));
      res.status(200).json({ message: "削除完了" });
    } catch (err) {
      res.status(500).json({ error: "削除エラー" });
    }
  }
}
