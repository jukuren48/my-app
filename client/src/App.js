import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import EnglishTrapQuestions from "./components/EnglishTrapQuestions";
import QuestionAdmin from "./components/QuestionAdmin";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <div className="text-2xl font-bold">塾∞練 JUKUREN</div>
          <nav className="flex space-x-4">
            <Link to="/" className="hover:underline">
              生徒用
            </Link>
            <Link to="/admin" className="hover:underline">
              教師用
            </Link>
          </nav>
        </header>

        <main className="p-4">
          <Routes>
            <Route path="/" element={<EnglishTrapQuestions />} />
            <Route path="/admin" element={<QuestionAdmin />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
