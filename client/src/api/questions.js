import fs from "fs/promises";
import path from "path";

export default async function handler(req, res) {
  try {
    const filePath = path.join(
      process.cwd(),
      "client",
      "public",
      "questions.json"
    );
    const jsonData = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(jsonData);
    res.status(200).json(data);
  } catch (err) {
    console.error("読み込みエラー:", err);
    res.status(500).json({ error: "データ読み込みエラー" });
  }
}
