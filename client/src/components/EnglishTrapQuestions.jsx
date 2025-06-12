import { useState, useEffect, useRef } from "react";

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
  const [disabledChoices, setDisabledChoices] = useState({});
  const [incorrectChoice, setIncorrectChoice] = useState(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const [mistakeMade, setMistakeMade] = useState({});
  const [mistakeDetails, setMistakeDetails] = useState([]);
  const [numQuestions, setNumQuestions] = useState("all");
  const timerRef = useRef(null);
  const startTime = useRef(Date.now());

  useEffect(() => {
    fetch(`/api/questions`)
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
        const allUnits = Array.from(new Set(data.map((q) => q.unit)));
        setUnits(allUnits);
      });
  }, []);

  useEffect(() => {
    if (
      !showQuestions ||
      showCorrect ||
      currentIndex >= filteredQuestions.length
    )
      return;

    clearInterval(timerRef.current);
    const current = filteredQuestions[currentIndex];
    const timeLimit = current?.unit === "読解" ? 20 : 10;
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
  }, [showQuestions, currentIndex, showCorrect]);

  const shuffleArray = (array) =>
    array
      .map((v) => ({ v, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ v }) => v);

  const handleStart = () => {
    const selected = questions.filter((q) => selectedUnits.includes(q.unit));
    const shuffled = shuffleArray(selected).map((q, idx) => ({
      ...q,
      key: `${q.unit}-${idx}`,
    }));
    const limited =
      numQuestions === "all"
        ? shuffled
        : shuffled.slice(0, parseInt(numQuestions, 10));
    setFilteredQuestions(limited);
    setShowQuestions(true);
    setShowResult(false);
    setCurrentIndex(0);
    setAnswers({});
    setMistakeMade({});
    setMistakeDetails([]);
    startTime.current = Date.now();
  };

  const handleTimeOver = () => {
    const current = filteredQuestions[currentIndex];
    const key = current.key;
    if (!answers[key]) {
      setMistakeMade((prev) => ({ ...prev, [key]: true }));
      setMistakeDetails((prev) => [
        ...prev,
        {
          question: current.question,
          correct: current.correct,
          mistake: "時間切れ",
        },
      ]);
    }
    setShowCorrect(true);
  };

  const handleChoice = (choice) => {
    const current = filteredQuestions[currentIndex];
    const key = current.key;
    const elapsed = (Date.now() - startTime.current) / 1000;

    if (choice === current.correct) {
      setAnswers((prev) => ({ ...prev, [key]: choice }));
      setShowCorrect(true);
    } else {
      setIncorrectChoice(choice);
      setDisabledChoices((prev) => ({
        ...prev,
        [key]: [...(prev[key] || []), choice],
      }));
      setMistakeMade((prev) => ({ ...prev, [key]: true }));
      setMistakeDetails((prev) => [
        ...prev,
        {
          question: current.question,
          correct: current.correct,
          mistake: choice,
        },
      ]);
    }
  };

  const handleNext = () => {
    setIncorrectChoice(null);
    if (currentIndex + 1 < filteredQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setShowCorrect(false);
      setTimeLeft(10);
      startTime.current = Date.now();
    } else {
      setShowResult(true);
    }
  };

  const currentQuestion = filteredQuestions[currentIndex];
  const total = filteredQuestions.length;
  const correct = filteredQuestions.filter(
    (q) => answers[q.key] === q.correct
  ).length;

  return (
    <div className="max-w-3xl mx-auto p-4">
      {!showQuestions && !showResult && (
        <>
          <h2 className="text-2xl mb-2">出題単元を選択</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {units.map((unit) => (
              <label key={unit}>
                <input
                  type="checkbox"
                  value={unit}
                  checked={selectedUnits.includes(unit)}
                  onChange={(e) =>
                    setSelectedUnits(
                      e.target.checked
                        ? [...selectedUnits, unit]
                        : selectedUnits.filter((u) => u !== unit)
                    )
                  }
                />{" "}
                {unit}
              </label>
            ))}
          </div>

          <div className="mb-4">
            <label>出題数:</label>
            <select
              value={numQuestions}
              onChange={(e) => setNumQuestions(e.target.value)}
              className="ml-2 border p-1"
            >
              <option value="5">5問</option>
              <option value="10">10問</option>
              <option value="20">20問</option>
              <option value="all">すべて</option>
            </select>
          </div>

          <button
            onClick={handleStart}
            disabled={selectedUnits.length === 0}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            出題開始
          </button>
        </>
      )}

      {showQuestions && currentQuestion && (
        <div className="p-4 border rounded shadow">
          <div className="mb-2">残り時間: {timeLeft}秒</div>
          <p className="font-bold mb-4">
            Q{currentIndex + 1}: {currentQuestion.question}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {currentQuestion.choices.map((choice) => (
              <button
                key={choice}
                onClick={() => handleChoice(choice)}
                disabled={showCorrect}
                className={`p-2 border rounded 
                  ${
                    showCorrect && choice === currentQuestion.correct
                      ? "bg-green-300"
                      : ""
                  }
                  ${incorrectChoice === choice ? "bg-red-300" : ""}
                `}
              >
                {choice}
              </button>
            ))}
          </div>

          {incorrectChoice && (
            <div className="mt-4 text-red-600">
              ❌ {incorrectChoice}:{" "}
              {currentQuestion.incorrectExplanations[incorrectChoice]}
            </div>
          )}

          {showCorrect && (
            <div className="mt-4 text-green-700">
              ✅ 正解！ {currentQuestion.explanation}
            </div>
          )}

          {showCorrect && (
            <button
              onClick={handleNext}
              className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded"
            >
              次へ
            </button>
          )}
        </div>
      )}

      {showResult && (
        <div className="text-center">
          <h2 className="text-2xl text-green-600 font-bold mb-4">結果発表！</h2>
          <p className="text-xl mb-2">
            正答率: {Math.round((correct / total) * 100)}%
          </p>
          <button
            onClick={() => {
              setShowQuestions(false);
              setShowResult(false);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            もう一度やる
          </button>
        </div>
      )}
    </div>
  );
}
