import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import EnglishTrapQuestions from "./components/EnglishTrapQuestions";
import AdminPage from "./components/AdminPage";

export default function App() {
  return (
    <Router>
      <div className="max-w-3xl mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-bold mb-6 text-center">
          塾∞練 JUKUREN - 英語ひっかけ問題
        </h1>
        <nav className="flex justify-center space-x-4 mb-8">
          <Link to="/" className="px-4 py-2 bg-blue-500 text-white rounded">
            生徒用
          </Link>
          <Link
            to="/admin"
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            教師用
          </Link>
        </nav>
        <Routes>
          <Route path="/" element={<EnglishTrapQuestions />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  );
}
