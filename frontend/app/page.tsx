"use client";

import { useState } from "react";
import {
  Upload,
  FileText,
  Sparkles,
} from "lucide-react";

export default function Home() {

  const [file, setFile] = useState<File | null>(null);

  const [message, setMessage] = useState("");

  const [feedback, setFeedback] = useState("");

  const [atsScore, setAtsScore] = useState(0);

  const [detectedSkills, setDetectedSkills] = useState<string[]>([]);

  const [missingSkills, setMissingSkills] = useState<string[]>([]);

  const uploadResume = async () => {

    try {

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

      setAtsScore(data.atsScore);

      setDetectedSkills(data.detectedSkills);

      setMissingSkills(data.missingSkills);

    } catch (error) {

      console.log(error);

      setMessage("Backend connection failed ❌");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white flex items-center justify-center p-6">

      <div className="w-full max-w-6xl bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl p-10">

        <div className="text-center mb-10">

          <h1 className="text-6xl font-extrabold mb-4 flex items-center justify-center gap-3">
            ResumeIQ AI
            <Sparkles className="text-yellow-400 w-12 h-12" />
          </h1>

          <p className="text-gray-400 text-lg">
            AI-Powered Resume Analyzer for ATS Optimization
          </p>

        </div>

        <div className="grid md:grid-cols-2 gap-8">

          <div className="bg-black/40 border border-white/10 rounded-2xl p-6">

            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Upload />
              Upload Resume
            </h2>

            <input
              type="file"
              accept=".pdf"
              onChange={(e) =>
                setFile(e.target.files?.[0] || null)
              }
              className="w-full border border-gray-700 rounded-lg p-3 bg-black text-white"
            />

            <button
              onClick={uploadResume}
              className="w-full mt-6 bg-white text-black font-semibold py-3 rounded-xl hover:bg-gray-300 transition"
            >
              Analyze Resume
            </button>

            {message && (
              <p className="mt-4 text-green-400">
                {message}
              </p>
            )}

          </div>

          <div className="bg-black/40 border border-white/10 rounded-2xl p-6">

            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FileText />
              AI Feedback
            </h2>

            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-5 min-h-[250px]">

              {feedback ? (
                <p className="text-gray-200 whitespace-pre-line leading-8">
                  {feedback}
                </p>
              ) : (
                <p className="text-gray-500">
                  Upload your resume to get AI-powered ATS analysis.
                </p>
              )}

            </div>

          </div>

        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-10">

          <div className="bg-black/40 border border-white/10 rounded-2xl p-6 text-center">

            <h2 className="text-2xl font-bold mb-4">
              ATS Score
            </h2>

            <div className="text-6xl font-extrabold text-green-400">
              {atsScore}%
            </div>

          </div>

          <div className="bg-black/40 border border-white/10 rounded-2xl p-6">

            <h2 className="text-2xl font-bold mb-4">
              Detected Skills
            </h2>

            <div className="flex flex-wrap gap-2">

              {detectedSkills.map((skill, index) => (

                <span
                  key={index}
                  className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full"
                >
                  {skill}
                </span>

              ))}

            </div>

          </div>

          <div className="bg-black/40 border border-white/10 rounded-2xl p-6">

            <h2 className="text-2xl font-bold mb-4">
              Missing Skills
            </h2>

            <div className="flex flex-wrap gap-2">

              {missingSkills.map((skill, index) => (

                <span
                  key={index}
                  className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full"
                >
                  {skill}
                </span>

              ))}

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}