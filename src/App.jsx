import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import EnglishTrapQuestions from "./components/EnglishTrapQuestions";
import AdminPage from "./components/AdminPage";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-600 text-white py-4 px-8 flex justify-between items-center shadow">
          <div className="text-2xl font-bold">
            塾∞練 JUKUREN 英語ひっかけ問題
          </div>
          <nav className="space-x-4">
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
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>

        <footer className="text-center text-sm py-4 text-gray-500">
          &copy; 2025 塾∞練 JUKUREN
        </footer>
      </div>
    </Router>
  );
}
