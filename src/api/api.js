const API_BASE = import.meta.env.PROD
  ? `${window.location.origin}/api`
  : "http://localhost:3000/api";

export const fetchQuestions = async () => {
  const res = await fetch(`${API_BASE}/questions`);
  return res.json();
};

export const addQuestion = async (question) => {
  const res = await fetch(`${API_BASE}/questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(question),
  });
  return res.json();
};

export const updateQuestion = async (question) => {
  const res = await fetch(`${API_BASE}/questions`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(question),
  });
  return res.json();
};

export const deleteQuestion = async (id) => {
  const res = await fetch(`${API_BASE}/questions?id=${id}`, {
    method: "DELETE",
  });
  return res.json();
};
