import React, { useEffect, useState } from "react";

export default function EnglishTrapQuestions() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch("/api/questions")
      .then((res) => res.json())
      .then((data) => setQuestions(data));
  }, []);

  const handleAnswer = (choice) => {
    const isCorrect = choice === questions[currentIndex].correct;
    setSelected(choice);
    setResult(isCorrect);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
    setSelected(null);
    setResult(null);
  };

  if (questions.length === 0) {
    return <div>問題読み込み中...</div>;
  }

  const question = questions[currentIndex];
  return (
    <div className="p-4">
      <p className="mb-4 font-medium">
        Q{currentIndex + 1}: {question.question}
      </p>
      <div className="space-y-2">
        {question.choices.map((choice) => (
          <button
            key={choice}
            className={`px-4 py-2 rounded border w-full ${
              selected === choice
                ? result
                  ? "bg-green-300"
                  : "bg-red-300"
                : "bg-white"
            }`}
            disabled={selected !== null}
            onClick={() => handleAnswer(choice)}
          >
            {choice}
          </button>
        ))}
      </div>
      {selected && (
        <div className="mt-4">
          {result ? "⭕ 正解です！" : "❌ 不正解"}
          <div className="mt-2">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={handleNext}
            >
              次へ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
