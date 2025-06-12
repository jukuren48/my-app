import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminPage() {
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({
    unit: "",
    question: "",
    choices: ["", "", "", ""],
    correct: "",
    explanation: "",
    incorrectExplanations: ["", "", "", ""],
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = () => {
    axios.get("/api/questions").then((res) => {
      setQuestions(res.data);
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleChoiceChange = (index, value) => {
    const newChoices = [...form.choices];
    newChoices[index] = value;
    setForm((prev) => ({ ...prev, choices: newChoices }));
  };

  const handleIncorrectChange = (index, value) => {
    const newIncorrect = [...form.incorrectExplanations];
    newIncorrect[index] = value;
    setForm((prev) => ({ ...prev, incorrectExplanations: newIncorrect }));
  };

  const handleSubmit = () => {
    if (!form.choices.includes(form.correct)) {
      alert("正解は選択肢の中から選んでください");
      return;
    }
    axios.post("/api/questions", form).then(() => {
      fetchQuestions();
      setForm({
        unit: "",
        question: "",
        choices: ["", "", "", ""],
        correct: "",
        explanation: "",
        incorrectExplanations: ["", "", "", ""],
      });
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">教師用問題管理</h1>

      <div className="mb-8 p-4 border rounded shadow bg-gray-50">
        <h2 className="font-bold mb-2">新規問題作成</h2>

        <input
          className="border p-2 rounded w-full mb-2"
          name="unit"
          value={form.unit}
          onChange={handleChange}
          placeholder="単元名"
        />
        <input
          className="border p-2 rounded w-full mb-2"
          name="question"
          value={form.question}
          onChange={handleChange}
          placeholder="問題文"
        />

        <div className="grid grid-cols-1 gap-2 mb-2">
          {form.choices.map((choice, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                className="border p-2 rounded flex-1"
                value={choice}
                onChange={(e) => handleChoiceChange(idx, e.target.value)}
                placeholder={`選択肢${idx + 1}`}
              />
              <input
                className="border p-2 rounded flex-1"
                value={form.incorrectExplanations[idx]}
                onChange={(e) => handleIncorrectChange(idx, e.target.value)}
                placeholder={`誤答解説${idx + 1}`}
              />
            </div>
          ))}
        </div>

        <input
          className="border p-2 rounded w-full mb-2"
          name="correct"
          value={form.correct}
          onChange={handleChange}
          placeholder="正解の選択肢を正確に入力"
        />
        <input
          className="border p-2 rounded w-full mb-2"
          name="explanation"
          value={form.explanation}
          onChange={handleChange}
          placeholder="正解の解説"
        />

        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleSubmit}
        >
          登録
        </button>
      </div>

      <h2 className="font-bold mb-4">現在登録されている問題</h2>
      <ul className="space-y-2">
        {questions.map((q, idx) => (
          <li key={idx} className="p-2 border rounded bg-white">
            <div>
              <b>{q.unit}</b>: {q.question}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
