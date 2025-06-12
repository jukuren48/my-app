import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function EnglishTrapQuestions() {
  const [questions, setQuestions] = useState([]);
  const [units, setUnits] = useState([]);
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const timerRef = useRef(null);

  useEffect(() => {
    axios.get("/api/questions").then((res) => {
      setQuestions(res.data);
      const uniqueUnits = [...new Set(res.data.map((q) => q.unit))];
      setUnits(uniqueUnits);
    });
  }, []);

  useEffect(() => {
    if (filteredQuestions.length === 0 || showResult) return;
    setTimeLeft(10);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAnswer(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [currentIndex, filteredQuestions]);

  const handleStart = () => {
    const selected = questions.filter((q) => selectedUnits.includes(q.unit));
    const shuffled = selected.sort(() => Math.random() - 0.5);
    setFilteredQuestions(shuffled);
    setCurrentIndex(0);
    setCorrectCount(0);
    setShowResult(false);
  };

  const handleAnswer = (choice) => {
    clearInterval(timerRef.current);
    const current = filteredQuestions[currentIndex];
    if (choice === current.correct) {
      setCorrectCount((prev) => prev + 1);
    }
    if (currentIndex + 1 < filteredQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        中学英語・ひっかけ問題
      </h1>

      {!showResult && filteredQuestions.length === 0 && (
        <>
          <p>出題する単元を選択してください：</p>
          <div className="flex flex-wrap gap-2 my-3">
            {units.map((unit) => (
              <label key={unit} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  value={unit}
                  checked={selectedUnits.includes(unit)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setSelectedUnits((prev) =>
                      checked ? [...prev, unit] : prev.filter((u) => u !== unit)
                    );
                  }}
                />
                {unit}
              </label>
            ))}
          </div>
          <button
            onClick={handleStart}
            className="px-4 py-2 bg-blue-500 text-white rounded"
            disabled={selectedUnits.length === 0}
          >
            出題開始
          </button>
        </>
      )}

      {!showResult && filteredQuestions.length > 0 && (
        <div>
          <p className="mb-2">残り時間: {timeLeft}秒</p>
          <div className="border p-4 rounded shadow">
            <p className="font-medium mb-3">
              Q{currentIndex + 1}. {filteredQuestions[currentIndex].question}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {filteredQuestions[currentIndex].choices.map((choice) => (
                <button
                  key={choice}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                  onClick={() => handleAnswer(choice)}
                >
                  {choice}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showResult && (
        <div className="text-center mt-10">
          <h2 className="text-3xl font-bold text-green-600">結果発表！</h2>
          <p className="mt-4 text-xl">
            正答率：
            {Math.round((correctCount / filteredQuestions.length) * 100)}%
          </p>
          <button
            onClick={() => {
              setFilteredQuestions([]);
              setSelectedUnits([]);
            }}
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
          >
            もう一度やる
          </button>
        </div>
      )}
    </div>
  );
}
