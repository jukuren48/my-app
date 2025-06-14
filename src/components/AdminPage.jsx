import React, { useState, useEffect } from "react";

export default function AdminPage() {
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({
    unit: "",
    question: "",
    choices: ["", "", "", ""],
    correct: "",
    explanation: "",
    incorrectExplanations: { "": "" },
  });

  const loadQuestions = () => {
    fetch("/api/questions")
      .then((res) => res.json())
      .then((data) => setQuestions(data));
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleChoiceChange = (index, value) => {
    const newChoices = [...form.choices];
    newChoices[index] = value;
    setForm((prev) => ({ ...prev, choices: newChoices }));
  };

  const handleSubmit = () => {
    fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }).then(() => {
      loadQuestions();
      setForm({
        unit: "",
        question: "",
        choices: ["", "", "", ""],
        correct: "",
        explanation: "",
        incorrectExplanations: { "": "" },
      });
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">問題追加</h2>
      <input
        className="border p-2 w-full"
        placeholder="Unit"
        value={form.unit}
        onChange={(e) => handleChange("unit", e.target.value)}
      />
      <input
        className="border p-2 w-full"
        placeholder="Question"
        value={form.question}
        onChange={(e) => handleChange("question", e.target.value)}
      />
      {form.choices.map((choice, i) => (
        <input
          key={i}
          className="border p-2 w-full"
          placeholder={`Choice ${i + 1}`}
          value={choice}
          onChange={(e) => handleChoiceChange(i, e.target.value)}
        />
      ))}
      <input
        className="border p-2 w-full"
        placeholder="Correct Answer"
        value={form.correct}
        onChange={(e) => handleChange("correct", e.target.value)}
      />
      <input
        className="border p-2 w-full"
        placeholder="Explanation"
        value={form.explanation}
        onChange={(e) => handleChange("explanation", e.target.value)}
      />
      <button
        className="px-4 py-2 bg-green-500 text-white rounded"
        onClick={handleSubmit}
      >
        追加
      </button>

      <h3 className="text-lg font-semibold mt-6">登録済みの問題一覧</h3>
      <ul className="list-disc pl-5">
        {questions.map((q, i) => (
          <li key={i}>{q.question}</li>
        ))}
      </ul>
    </div>
  );
}
