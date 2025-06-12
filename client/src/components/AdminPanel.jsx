import React, { useState, useEffect } from "react";

export default function AdminPanel() {
  const [questions, setQuestions] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    id: "",
    unit: "",
    question: "",
    choices: ["", "", "", ""],
    correct: "",
    explanation: "",
    incorrectExplanations: {},
  });

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/questions.json`)
      .then((res) => res.json())
      .then((data) => setQuestions(data));
  }, []);

  const handleSave = () => {
    let updated = [...questions];
    if (editingIndex !== null) {
      updated[editingIndex] = newQuestion;
    } else {
      updated.push(newQuestion);
    }
    setQuestions(updated);
    setEditingIndex(null);
    setNewQuestion({
      id: "",
      unit: "",
      question: "",
      choices: ["", "", "", ""],
      correct: "",
      explanation: "",
      incorrectExplanations: {},
    });
  };

  const handleEdit = (index) => {
    setNewQuestion(questions[index]);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const handleDownload = () => {
    const fileData = JSON.stringify(questions, null, 2);
    const blob = new Blob([fileData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "questions.json";
    link.href = url;
    link.click();
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-8">教師用 管理画面</h1>
      <button
        onClick={handleDownload}
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded"
      >
        JSONダウンロード
      </button>

      <div className="border p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-2">
          {editingIndex !== null ? "問題を編集" : "新規問題作成"}
        </h2>
        <div className="space-y-2">
          <input
            className="border px-2 py-1 w-full"
            placeholder="ID"
            value={newQuestion.id}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, id: e.target.value })
            }
          />
          <input
            className="border px-2 py-1 w-full"
            placeholder="Unit（単元名）"
            value={newQuestion.unit}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, unit: e.target.value })
            }
          />
          <textarea
            className="border px-2 py-1 w-full"
            placeholder="問題文"
            value={newQuestion.question}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, question: e.target.value })
            }
          />
          {newQuestion.choices.map((choice, i) => (
            <input
              key={i}
              className="border px-2 py-1 w-full"
              placeholder={`選択肢${i + 1}`}
              value={choice}
              onChange={(e) => {
                const updatedChoices = [...newQuestion.choices];
                updatedChoices[i] = e.target.value;
                setNewQuestion({ ...newQuestion, choices: updatedChoices });
              }}
            />
          ))}
          <input
            className="border px-2 py-1 w-full"
            placeholder="正解"
            value={newQuestion.correct}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, correct: e.target.value })
            }
          />
          <textarea
            className="border px-2 py-1 w-full"
            placeholder="正解の説明"
            value={newQuestion.explanation}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, explanation: e.target.value })
            }
          />
        </div>

        <button
          onClick={handleSave}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          保存
        </button>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">登録済みの問題一覧</h2>
        <div className="overflow-y-auto max-h-[600px] border p-2">
          {questions.map((q, index) => (
            <div key={index} className="p-2 border-b">
              <div className="font-bold">
                {q.unit} - {q.question}
              </div>
              <button
                className="mr-2 text-blue-600"
                onClick={() => handleEdit(index)}
              >
                編集
              </button>
              <button
                className="text-red-600"
                onClick={() => handleDelete(index)}
              >
                削除
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
