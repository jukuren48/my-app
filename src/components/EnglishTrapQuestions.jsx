import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [answerTimes, setAnswerTimes] = useState({});
  const [startTime, setStartTime] = useState(null);
  const [mistakeDetails, setMistakeDetails] = useState([]);
  const [numQuestions, setNumQuestions] = useState("all");
  const timerRef = useRef(null);

  useEffect(() => {
    fetch("http://localhost:5000/questions")
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
    if (timerRef.current) clearInterval(timerRef.current);
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

  const resetState = () => {
    setAnswers({});
    setDisabledChoices({});
    setMistakeMade({});
    setAnswerTimes({});
    setMistakeDetails([]);
    setCurrentIndex(0);
    setTimeLeft(10);
    setShowCorrect(false);
    setIncorrectChoice(null);
    setShowQuestions(false);
    setShowResult(false);
  };

  const handleRetryMistakes = () => {
    const allMistakes = filteredQuestions.filter((q) => mistakeMade[q.key]);
    const reshuffled = shuffleArray(
      allMistakes.map((q) => ({ ...q, choices: shuffleArray(q.choices) }))
    );
    setFilteredQuestions(reshuffled);
    resetState();
    setShowQuestions(true);
    setStartTime(Date.now());
  };

  const handleUnitChange = (e) => {
    const { value, checked } = e.target;
    setSelectedUnits((prev) =>
      checked ? [...prev, value] : prev.filter((u) => u !== value)
    );
  };

  const handleStart = () => {
    resetState();
    const selected = questions.filter((q) => selectedUnits.includes(q.unit));
    const shuffled = shuffleArray(selected).map((q, idx) => ({
      ...q,
      key: `${q.unit}-${idx}`,
    }));
    let limited = shuffled;
    if (numQuestions !== "all")
      limited = shuffled.slice(0, parseInt(numQuestions, 10));
    setFilteredQuestions(limited);
    setShowQuestions(true);
    setStartTime(Date.now());
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
    const elapsed = (Date.now() - startTime) / 1000;
    if (choice === current.correct) {
      setAnswers((prev) => ({ ...prev, [key]: choice }));
      setAnswerTimes((prev) => ({ ...prev, [key]: elapsed }));
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

  const handleContinue = () => setIncorrectChoice(null);
  const handleNext = () => {
    if (currentIndex + 1 < filteredQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setTimeLeft(10);
      setShowCorrect(false);
      setIncorrectChoice(null);
      setStartTime(Date.now());
    } else {
      setShowResult(true);
    }
  };

  const currentQuestion = filteredQuestions[currentIndex];
  const finalTotal = filteredQuestions.length;
  const finalCorrect = filteredQuestions.filter(
    (q) => answers[q.key] === q.correct
  ).length;

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* ロゴ表示 */}
      <div className="flex justify-center mb-4">
        <img
          src={`${process.env.PUBLIC_URL}/logo.png`}
          alt="JUKUREN LOGO"
          className="h-24"
        />
      </div>
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
        塾∞練 JUKUREN - 英語ひっかけ問題
      </h1>

      {!showQuestions && !showResult && (
        <div className="space-y-4">
          <div>
            <p className="font-medium">出題範囲：</p>
            <div className="flex flex-wrap gap-2">
              {units.map((unit) => (
                <label key={unit} className="flex items-center space-x-1">
                  <input
                    type="checkbox"
                    value={unit}
                    checked={selectedUnits.includes(unit)}
                    onChange={handleUnitChange}
                  />
                  <span>{unit}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="font-medium">出題数:</label>
            <select
              value={numQuestions}
              onChange={(e) => setNumQuestions(e.target.value)}
              className="border p-1 rounded ml-2"
            >
              <option value="5">5問</option>
              <option value="10">10問</option>
              <option value="20">20問</option>
              <option value="all">すべて</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setSelectedUnits(units)}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              すべて選択
            </button>
            <button
              onClick={() => setSelectedUnits([])}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              すべて解除
            </button>
          </div>

          <button
            onClick={handleStart}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            disabled={selectedUnits.length === 0}
          >
            出題開始
          </button>
        </div>
      )}

      {showQuestions && !showResult && currentQuestion && (
        <div>
          <div className="mb-4 text-lg">
            得点：{finalCorrect} / {finalTotal}
          </div>
          <div className="text-sm text-gray-500 mb-2">
            残り時間：{timeLeft} 秒
          </div>

          <div className="p-4 border rounded shadow">
            <p className="font-medium">
              Q{currentIndex + 1}. {currentQuestion.question}
            </p>
            <div className="grid grid-cols-2 gap-3 mt-3">
              {currentQuestion.choices.map((choice) => (
                <motion.button
                  key={choice}
                  whileTap={{ scale: 0.95 }}
                  className={`border py-2 rounded text-lg ${
                    showCorrect && choice === currentQuestion.correct
                      ? "bg-green-300"
                      : (disabledChoices[currentQuestion.key] || []).includes(
                          choice
                        )
                      ? "bg-red-200"
                      : "bg-white"
                  }`}
                  onClick={() => handleChoice(choice)}
                  disabled={
                    showCorrect ||
                    (disabledChoices[currentQuestion.key] || []).includes(
                      choice
                    )
                  }
                >
                  {choice}
                </motion.button>
              ))}
            </div>

            <AnimatePresence>
              {incorrectChoice && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 bg-red-100 p-3 rounded"
                >
                  ❌ {incorrectChoice}:{" "}
                  {currentQuestion.incorrectExplanations[incorrectChoice]}
                  <div className="mt-2">
                    <button
                      onClick={handleContinue}
                      className="px-4 py-2 bg-yellow-500 text-white rounded"
                    >
                      続ける
                    </button>
                  </div>
                </motion.div>
              )}

              {showCorrect && !incorrectChoice && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="mt-4 text-green-700"
                >
                  ✅ 正解！{currentQuestion.explanation}
                  <div className="mt-3">
                    <button
                      onClick={handleNext}
                      className="px-4 py-2 bg-indigo-500 text-white rounded"
                    >
                      {currentIndex + 1 === filteredQuestions.length
                        ? "結果を見る"
                        : "次へ ➤"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {showResult && (
        <div className="text-center mt-10">
          <h2 className="text-3xl text-green-600 font-bold">結果発表！</h2>
          <p className="text-2xl mt-3">
            正答率：{Math.round((finalCorrect / finalTotal) * 100)}%
          </p>
          <p className="text-lg mt-2">
            {finalCorrect}問正解 / 全{finalTotal}問
          </p>

          {mistakeDetails.length > 0 && (
            <div className="mt-5 text-left">
              <h3 className="text-xl text-red-600 font-semibold">
                間違えた問題一覧
              </h3>
              <ul className="mt-2 space-y-2">
                {mistakeDetails.map((item, idx) => (
                  <li key={idx} className="p-2 bg-red-50 rounded border">
                    <strong>Q:</strong> {item.question}
                    <br />
                    <strong>あなたの答え:</strong> {item.mistake}
                    <br />
                    <strong>正解:</strong> {item.correct}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={resetState}
              className="px-6 py-3 bg-blue-500 text-white rounded"
            >
              もう一度やる
            </button>
            {mistakeDetails.length > 0 && (
              <button
                onClick={handleRetryMistakes}
                className="px-6 py-3 bg-red-500 text-white rounded"
              >
                間違えたところだけ再チャレ！
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
