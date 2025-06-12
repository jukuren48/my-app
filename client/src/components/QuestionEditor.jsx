import React, { useState } from "react";

export default function QuestionEditor() {
  const [unit, setUnit] = useState("");
  const [question, setQuestion] = useState("");
  const [choices, setChoices] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(null);
  const [explanation, setExplanation] = useState("");
  const [incorrectExplanations, setIncorrectExplanations] = useState([
    "",
    "",
    "",
    "",
  ]);

  const handleChoiceChange = (index, value) => {
    const newChoices = [...choices];
    newChoices[index] = value;
    setChoices(newChoices);
  };

  const handleIncorrectExplanationChange = (index, value) => {
    const newExplanations = [...incorrectExplanations];
    newExplanations[index] = value;
    setIncorrectExplanations(newExplanations);
  };

  const handleSave = () => {
    if (correctIndex === null) {
      alert("正解を選んでください！");
      return;
    }
    const incorrectObj = {};
    choices.forEach((choice, idx) => {
      incorrectObj[choice] = incorrectExplanations[idx];
    });

    const newQuestion = {
      unit,
      question,
      choices,
      correct: choices[correctIndex],
      explanation,
      incorrectExplanations: incorrectObj,
    };

    console.log("保存するデータ:", newQuestion);
    alert("仮保存しました！（※今は仮です。後でファイル保存機能を実装予定）");
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-4">問題登録画面 (教師用)</h2>

      <div>
        <label>Unit:</label>
        <input
          className="border w-full p-2"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        />
      </div>

      <div>
        <label>Question:</label>
        <textarea
          className="border w-full p-2"
          rows={3}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>

      {choices.map((choice, idx) => (
        <div key={idx} className="space-y-1 border p-2 rounded bg-gray-50">
          <div className="flex items-center">
            <label className="mr-2">Choice {idx + 1}:</label>
            <input
              className="border p-1 flex-1"
              value={choice}
              onChange={(e) => handleChoiceChange(idx, e.target.value)}
            />
            <label className="ml-4">
              <input
                type="radio"
                name="correct"
                checked={correctIndex === idx}
                onChange={() => setCorrectIndex(idx)}
              />
              正解
            </label>
          </div>
          <div>
            <label>Incorrect Explanation:</label>
            <input
              className="border w-full p-1"
              value={incorrectExplanations[idx]}
              onChange={(e) =>
                handleIncorrectExplanationChange(idx, e.target.value)
              }
            />
          </div>
        </div>
      ))}

      <div>
        <label>Explanation (正解の解説):</label>
        <textarea
          className="border w-full p-2"
          rows={3}
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
        />
      </div>

      <button
        className="bg-blue-600 text-white py-2 px-6 rounded"
        onClick={handleSave}
      >
        仮保存
      </button>
    </div>
  );
}
