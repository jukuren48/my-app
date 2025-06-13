import React, { useState, useEffect } from "react";

export default function AdminPage() {
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [form, setForm] = useState({
    unit: "",
    question: "",
    choices: ["", "", "", ""],
    correct: "",
    explanation: "",
    incorrectExplanations: { "": "" },
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const res = await fetch("/api/questions");
    const data = await res.json();
    setQuestions(data);
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleChoiceChange = (index, value) => {
    const updatedChoices = [...form.choices];
    updatedChoices[index] = value;
    setForm({ ...form, choices: updatedChoices });
  };

  const handleIncorrectExplanationChange = (choice, value) => {
    setForm({
      ...form,
      incorrectExplanations: { ...form.incorrectExplanations, [choice]: value },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingQuestion) {
      await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/questions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, id: editingQuestion.id }),
      });
    }
    setForm({
      unit: "",
      question: "",
      choices: ["", "", "", ""],
      correct: "",
      explanation: "",
      incorrectExplanations: { "": "" },
    });
    setEditingQuestion(null);
    fetchQuestions();
  };

  const handleEdit = (q) => {
    setEditingQuestion(q);
    setForm(q);
  };

  const handleDelete = async (id) => {
    await fetch(`/api/questions?id=${id}`, { method: "DELETE" });
    fetchQuestions();
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">問題登録・編集画面</h1>

      <form className="mb-8 space-y-4" onSubmit={handleSubmit}>
        <input
          name="unit"
          value={form.unit}
          onChange={handleInputChange}
          placeholder="単元"
          className="border p-2 w-full"
        />
        <input
          name="question"
          value={form.question}
          onChange={handleInputChange}
          placeholder="問題文"
          className="border p-2 w-full"
        />
        {form.choices.map((choice, idx) => (
          <div key={idx} className="flex items-center space-x-2">
            <input
              value={choice}
              onChange={(e) => handleChoiceChange(idx, e.target.value)}
              placeholder={`選択肢 ${idx + 1}`}
              className="border p-2 w-full"
            />
            <input
              value={form.incorrectExplanations[choice] || ""}
              onChange={(e) =>
                handleIncorrectExplanationChange(choice, e.target.value)
              }
              placeholder="誤答の解説"
              className="border p-2 w-full"
            />
          </div>
        ))}
        <input
          name="correct"
          value={form.correct}
          onChange={handleInputChange}
          placeholder="正解"
          className="border p-2 w-full"
        />
        <input
          name="explanation"
          value={form.explanation}
          onChange={handleInputChange}
          placeholder="正解の解説"
          className="border p-2 w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {editingQuestion ? "更新" : "新規登録"}
        </button>
      </form>

      <h2 className="text-xl font-bold mb-2">登録済みの問題</h2>
      <div className="space-y-2">
        {questions.map((q) => (
          <div key={q.id} className="border p-4 rounded">
            <p>
              <strong>{q.unit}</strong> : {q.question}
            </p>
            <button
              onClick={() => handleEdit(q)}
              className="bg-yellow-400 text-white px-2 py-1 mr-2"
            >
              編集
            </button>
            <button
              onClick={() => handleDelete(q.id)}
              className="bg-red-500 text-white px-2 py-1"
            >
              削除
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
