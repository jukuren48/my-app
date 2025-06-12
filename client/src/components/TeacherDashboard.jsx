import React, { useState, useEffect } from "react";

export default function TeacherDashboard() {
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [form, setForm] = useState({
    unit: "",
    question: "",
    choices: ["", "", "", ""],
    correct: "",
    explanation: "",
    incorrectExplanations: {},
  });

  // questions.json 読み込み
  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/questions.json`)
      .then((res) => res.json())
      .then((data) => setQuestions(data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleChoiceChange = (index, value) => {
    const newChoices = [...form.choices];
    newChoices[index] = value;
    setForm((prev) => ({ ...prev, choices: newChoices }));
  };

  const handleIncorrectExplanationChange = (choice, value) => {
    setForm((prev) => ({
      ...prev,
      incorrectExplanations: {
        ...prev.incorrectExplanations,
        [choice]: value,
      },
    }));
  };

  const handleSave = () => {
    if (!form.correct || !form.choices.includes(form.correct)) {
      alert("正解が選択肢に含まれていません！");
      return;
    }

    const newQuestion = {
      id: editingQuestion ? editingQuestion.id : questions.length + 1,
      ...form,
    };

    const updatedQuestions = editingQuestion
      ? questions.map((q) => (q.id === editingQuestion.id ? newQuestion : q))
      : [...questions, newQuestion];

    setQuestions(updatedQuestions);
    setEditingQuestion(null);
    resetForm();
  };

  const resetForm = () => {
    setForm({
      unit: "",
      question: "",
      choices: ["", "", "", ""],
      correct: "",
      explanation: "",
      incorrectExplanations: {},
    });
  };

  const handleEdit = (q) => {
    setEditingQuestion(q);
    setForm(q);
  };

  const handleDelete = (id) => {
    if (!window.confirm("本当に削除しますか？")) return;
    setQuestions(questions.filter((q) => q.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">教師用 管理画面（プロ版）</h1>

      <div className="bg-white shadow p-4 rounded mb-8">
        <h2 className="text-xl font-semibold mb-2">
          {editingQuestion ? "問題を編集" : "新規問題を作成"}
        </h2>

        <div className="grid gap-3">
          <input
            className="border p-2 rounded"
            placeholder="単元 (unit)"
            name="unit"
            value={form.unit}
            onChange={handleChange}
          />

          <input
            className="border p-2 rounded"
            placeholder="問題文"
            name="question"
            value={form.question}
            onChange={handleChange}
          />

          {form.choices.map((choice, idx) => (
            <div key={idx}>
              <input
                className="border p-2 rounded w-2/3"
                placeholder={`選択肢 ${idx + 1}`}
                value={choice}
                onChange={(e) => handleChoiceChange(idx, e.target.value)}
              />

              <input
                className="border p-2 rounded w-1/3 ml-2"
                placeholder="誤答時の解説"
                value={form.incorrectExplanations[choice] || ""}
                onChange={(e) =>
                  handleIncorrectExplanationChange(choice, e.target.value)
                }
              />
            </div>
          ))}

          <input
            className="border p-2 rounded"
            placeholder="正解 (正しくchoicesの中から選択)"
            name="correct"
            value={form.correct}
            onChange={handleChange}
          />

          <input
            className="border p-2 rounded"
            placeholder="全体の解説"
            name="explanation"
            value={form.explanation}
            onChange={handleChange}
          />

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleSave}
          >
            {editingQuestion ? "更新" : "保存"}
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">
          登録済みの問題 ({questions.length}問)
        </h2>
        <div className="space-y-3">
          {questions.map((q) => (
            <div
              key={q.id}
              className="p-3 border rounded bg-gray-50 flex justify-between"
            >
              <div>
                <div className="font-medium">
                  {q.unit}: {q.question}
                </div>
                <div className="text-sm text-gray-500">正解: {q.correct}</div>
              </div>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 bg-green-500 text-white rounded"
                  onClick={() => handleEdit(q)}
                >
                  編集
                </button>
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded"
                  onClick={() => handleDelete(q.id)}
                >
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
