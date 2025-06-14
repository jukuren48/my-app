import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function AdminPage() {
  const emptyQuestion = {
    unit: "",
    question: "",
    choices: ["", "", "", ""],
    correct: "",
    explanation: "",
    incorrectExplanations: {
      "": "",
    },
  };

  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState(emptyQuestion);

  useEffect(() => {
    async function fetchQuestions() {
      const data = await api.getQuestions();
      setQuestions(data);
    }
    fetchQuestions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion((prev) => ({ ...prev, [name]: value }));
  };

  const handleChoiceChange = (index, value) => {
    const updatedChoices = [...newQuestion.choices];
    updatedChoices[index] = value;
    setNewQuestion((prev) => ({ ...prev, choices: updatedChoices }));
  };

  const handleIncorrectExplanationChange = (choice, value) => {
    setNewQuestion((prev) => ({
      ...prev,
      incorrectExplanations: {
        ...prev.incorrectExplanations,
        [choice]: value,
      },
    }));
  };

  const handleAddQuestion = async () => {
    if (
      !newQuestion.correct ||
      !newQuestion.choices.includes(newQuestion.correct)
    ) {
      alert("正解が選択肢に含まれていません！");
      return;
    }

    await api.addQuestion(newQuestion);
    const updated = await api.getQuestions();
    setQuestions(updated);
    setNewQuestion(emptyQuestion);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">問題登録・編集画面</h1>

      <div className="mb-6">
        <h2 className="font-semibold mb-2">新規問題作成</h2>

        <div className="space-y-2">
          <input
            type="text"
            name="unit"
            placeholder="単元"
            value={newQuestion.unit}
            onChange={handleChange}
            className="border p-2 w-full"
          />
          <textarea
            name="question"
            placeholder="問題文"
            value={newQuestion.question}
            onChange={handleChange}
            className="border p-2 w-full"
          />

          {newQuestion.choices.map((choice, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <input
                type="text"
                placeholder={`選択肢${idx + 1}`}
                value={choice}
                onChange={(e) => handleChoiceChange(idx, e.target.value)}
                className="border p-2 flex-1"
              />
              <input
                type="radio"
                name="correct"
                value={choice}
                checked={newQuestion.correct === choice}
                onChange={(e) =>
                  handleChange({ target: { name: "correct", value: choice } })
                }
              />
              <span>正解</span>
            </div>
          ))}

          <div className="space-y-2">
            <h3 className="font-medium">正解の解説</h3>
            <textarea
              name="explanation"
              placeholder="正解の解説"
              value={newQuestion.explanation}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">誤答解説</h3>
            {newQuestion.choices.map((choice, idx) => (
              <div key={idx}>
                <p className="font-semibold">{choice}</p>
                <textarea
                  placeholder="誤答解説"
                  value={newQuestion.incorrectExplanations[choice] || ""}
                  onChange={(e) =>
                    handleIncorrectExplanationChange(choice, e.target.value)
                  }
                  className="border p-2 w-full"
                />
              </div>
            ))}
          </div>

          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleAddQuestion}
          >
            問題追加
          </button>
        </div>
      </div>

      <div>
        <h2 className="font-semibold mb-2">
          登録済みの問題一覧（{questions.length}件）
        </h2>
        <ul className="list-disc pl-5 space-y-1">
          {questions.map((q, idx) => (
            <li key={idx}>{q.question}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
