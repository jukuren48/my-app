import React, { useEffect, useState, useRef } from "react";
import api from "../api/api";

export default function EnglishTrapQuestions() {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [units, setUnits] = useState([]);
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [showQuestions, setShowQuestions] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState({});
  const [incorrectChoice, setIncorrectChoice] = useState(null);
  const [mistakeDetails, setMistakeDetails] = useState([]);
  const [numQuestions, setNumQuestions] = useState("all");
  const timerRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      const data = await api.getQuestions();
      setQuestions(data);
      const allUnits = [...new Set(data.map((q) => q.unit))];
      setUnits(allUnits);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!showQuestions || currentIndex >= filteredQuestions.length) return;
    if (timerRef.current) clearInterval(timerRef.current);
    const timeLimit = filteredQuestions[currentIndex].unit === "読解" ? 20 : 10;
    setTimeLeft(timeLimit);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [showQuestions, currentIndex]);

  const shuffleArray = (array) =>
    array
      .map((v) => ({ v, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ v }) => v);

  const handleStart = () => {
    const selected = questions.filter((q) => selectedUnits.includes(q.unit));
    const shuffled = shuffleArray(selected);
    const limited =
      numQuestions === "all"
        ? shuffled
        : shuffled.slice(0, parseInt(numQuestions, 10));
    setFilteredQuestions(limited);
    setCurrentIndex(0);
    setAnswers({});
    setMistakeDetails([]);
    setShowQuestions(true);
    setShowResult(false);
  };

  const handleTimeOver = () => {
    const current = filteredQuestions[currentIndex];
    setMistakeDetails((prev) => [
      ...prev,
      {
        question: current.question,
        correct: current.correct,
        mistake: "時間切れ",
      },
    ]);
    handleNext();
  };

  const handleChoice = (choice) => {
    const current = filteredQuestions[currentIndex];
    if (choice === current.correct) {
      setAnswers((prev) => ({ ...prev, [current.id]: choice }));
    } else {
      setMistakeDetails((prev) => [
        ...prev,
        {
          question: current.question,
          correct: current.correct,
          mistake: choice,
        },
      ]);
    }
    setIncorrectChoice(choice);
  };

  const handleNext = () => {
    setIncorrectChoice(null);
    if (currentIndex + 1 < filteredQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const finalTotal = filteredQuestions.length;
  const finalCorrect = Object.keys(answers).length;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">中学英語・ひっかけ問題</h1>

      {!showQuestions && !showResult && (
        <div>
          <p className="font-medium">出題単元を選んでください：</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {units.map((unit) => (
              <label key={unit} className="flex items-center space-x-1">
                <input
                  type="checkbox"
                  value={unit}
                  checked={selectedUnits.includes(unit)}
                  onChange={(e) => {
                    const { value, checked } = e.target;
                    setSelectedUnits((prev) =>
                      checked
                        ? [...prev, value]
                        : prev.filter((u) => u !== value)
                    );
                  }}
                />
                <span>{unit}</span>
              </label>
            ))}
          </div>
          <div className="mt-4">
            <label className="font-medium mr-2">出題数:</label>
            <select
              value={numQuestions}
              onChange={(e) => setNumQuestions(e.target.value)}
              className="border px-2 py-1 rounded"
            >
              <option value="5">5問</option>
              <option value="10">10問</option>
              <option value="20">20問</option>
              <option value="all">すべて</option>
            </select>
          </div>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleStart}
            disabled={selectedUnits.length === 0}
          >
            出題開始
          </button>
        </div>
      )}

      {showQuestions && !showResult && (
        <div>
          <div className="mb-2 text-sm text-gray-500">
            残り時間：{timeLeft} 秒
          </div>
          <div className="border p-4 rounded shadow">
            <p className="font-medium">
              Q{currentIndex + 1}. {filteredQuestions[currentIndex].question}
            </p>
            <div className="grid grid-cols-2 gap-2 mt-3">
              {filteredQuestions[currentIndex].choices.map((choice) => (
                <button
                  key={choice}
                  className={`border px-4 py-2 rounded ${
                    incorrectChoice === choice
                      ? "bg-red-300"
                      : answers[filteredQuestions[currentIndex].id] === choice
                      ? "bg-green-300"
                      : "bg-white"
                  }`}
                  onClick={() => handleChoice(choice)}
                  disabled={incorrectChoice !== null}
                >
                  {choice}
                </button>
              ))}
            </div>
            {incorrectChoice && (
              <div className="mt-4">
                <button
                  className="px-4 py-2 bg-indigo-500 text-white rounded"
                  onClick={handleNext}
                >
                  次へ ➤
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showResult && (
        <div className="text-center mt-10">
          <h2 className="text-3xl font-bold text-green-600">結果発表！</h2>
          <p className="text-2xl mt-4">
            正答率：{Math.round((finalCorrect / finalTotal) * 100)}%
          </p>
          <div className="mt-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => window.location.reload()}
            >
              もう一度やる
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
