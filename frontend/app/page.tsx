"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");

  const uploadResume = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    const res = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    setMessage(data.message);
    setFeedback(data.feedback);
  };

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-5xl font-bold mb-10 text-center">
        ResumeIQ AI 🚀
      </h1>

      <div className="max-w-xl mx-auto space-y-6">
        <input
          type="file"
          accept=".pdf"
          onChange={(e) =>
            setFile(e.target.files?.[0] || null)
          }
          className="border p-2 w-full"
        />

        <button
          onClick={uploadResume}
          className="bg-white text-black px-6 py-2 rounded w-full"
        >
          Analyze Resume
        </button>

        <p>{message}</p>

        <div className="bg-gray-900 p-4 rounded">
          <h2 className="text-2xl font-bold mb-2">
            AI Feedback
          </h2>

          <p>{feedback}</p>
        </div>
      </div>
    </main>
  );
}