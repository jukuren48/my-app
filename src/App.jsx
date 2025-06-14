import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import EnglishTrapQuestions from "./components/EnglishTrapQuestions";
import AdminPage from "./components/AdminPage";

function App() {
  return (
    <Router>
      <div className="max-w-5xl mx-auto p-4">
        <nav className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">塾∞練 英語ひっかけ問題</h1>
          <div className="space-x-4">
            <Link to="/" className="text-blue-500 font-semibold">
              生徒用
            </Link>
            <Link to="/admin" className="text-green-500 font-semibold">
              教師用
            </Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<EnglishTrapQuestions />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
