import { useState, useEffect } from "react";

export default function QuestionAdmin() {
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({
    unit: "",
    question: "",
    choices: ["", "", "", ""],
    correct: "",
    explanation: "",
    incorrectExplanations: {
      "": "",
    },
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/questions")
      .then((res) => res.json())
      .then((data) => setQuestions(data));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChoiceChange = (index, value) => {
    const newChoices = [...formData.choices];
    newChoices[index] = value;
    setFormData((prev) => ({
      ...prev,
      choices: newChoices,
      incorrectExplanations: {
        ...prev.incorrectExplanations,
        [value]: prev.incorrectExplanations[newChoices[index]] || "",
      },
    }));
  };

  const handleIncorrectExplanationChange = (choice, explanation) => {
    setFormData((prev) => ({
      ...prev,
      incorrectExplanations: {
        ...prev.incorrectExplanations,
        [choice]: explanation,
      },
    }));
  };

  const handleSubmit = () => {
    fetch("http://localhost:5000/api/add-question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    }).then(() => {
      alert("追加しました！");
      setFormData({
        unit: "",
        question: "",
        choices: ["", "", "", ""],
        correct: "",
        explanation: "",
        incorrectExplanations: {},
      });
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl mb-4 font-bold">教師用：問題登録</h2>

      <div className="mb-2">
        <label>単元:</label>
        <input
          name="unit"
          value={formData.unit}
          onChange={handleInputChange}
          className="border p-1 ml-2 w-64"
        />
      </div>

      <div className="mb-2">
        <label>問題文:</label>
        <input
          name="question"
          value={formData.question}
          onChange={handleInputChange}
          className="border p-1 ml-2 w-full"
        />
      </div>

      <div className="mb-2">
        <label>選択肢:</label>
        {formData.choices.map((choice, idx) => (
          <div key={idx} className="flex items-center mb-1">
            <input
              value={choice}
              onChange={(e) => handleChoiceChange(idx, e.target.value)}
              className="border p-1 w-64"
            />
            <input
              type="radio"
              name="correct"
              value={choice}
              checked={formData.correct === choice}
              onChange={() =>
                setFormData((prev) => ({ ...prev, correct: choice }))
              }
              className="ml-2"
            />{" "}
            正解
          </div>
        ))}
      </div>

      <div className="mb-2">
        <label>正解の解説:</label>
        <input
          name="explanation"
          value={formData.explanation}
          onChange={handleInputChange}
          className="border p-1 ml-2 w-full"
        />
      </div>

      <div className="mb-2">
        <label>誤答の解説:</label>
        {formData.choices
          .filter((c) => c)
          .map((choice) => (
            <div key={choice} className="mb-1">
              <div>「{choice}」の場合:</div>
              <input
                value={formData.incorrectExplanations[choice] || ""}
                onChange={(e) =>
                  handleIncorrectExplanationChange(choice, e.target.value)
                }
                className="border p-1 w-full"
              />
            </div>
          ))}
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        追加する
      </button>
    </div>
  );
}
