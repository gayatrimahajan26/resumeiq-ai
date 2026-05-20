"use client";

import { useEffect, useState } from "react";

import {
  Upload,
  FileText,
  AlertCircle,
  Loader2,
} from "lucide-react";

import {
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

export default function Home() {

  const { isSignedIn } = useUser();

  const [file, setFile] = useState<File | null>(null);

  const [jobDescription, setJobDescription] = useState("");

  const [feedback, setFeedback] = useState("");

  const [atsScore, setAtsScore] = useState(0);

  const [matchedSkills, setMatchedSkills] = useState<string[]>([]);

  const [missingSkills, setMissingSkills] = useState<string[]>([]);

  const [history, setHistory] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  // FETCH HISTORY
  useEffect(() => {

    fetch("http://localhost:5000/history")
      .then((res) => res.json())
      .then((data) => setHistory(data));

  }, []);

  // ANALYZE RESUME
  const uploadResume = async () => {

    if (!file || !jobDescription) {
      alert("Please upload resume and add job description");
      return;
    }

    setLoading(true);

    const formData = new FormData();

    formData.append("resume", file);

    formData.append("jobDescription", jobDescription);

    try {

      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      setFeedback(data.feedback);

      setAtsScore(data.atsScore);

      setMatchedSkills(data.matchedSkills);

      setMissingSkills(data.missingSkills);

      // REFRESH HISTORY
      fetch("http://localhost:5000/history")
        .then((res) => res.json())
        .then((data) => setHistory(data));

    } catch (error) {

      console.log(error);

      alert("Something went wrong");

    } finally {

      setLoading(false);

    }

  };

  return (

    <main className="min-h-screen bg-black text-white px-6 py-10">

      {/* TOP BAR */}
      <div className="flex justify-between items-center mb-10">

        <div>
          <h1 className="text-6xl font-bold">
            ResumeIQ AI 🚀
          </h1>

          <p className="text-gray-400 mt-2 text-xl">
            AI-Powered Resume Analyzer for ATS Optimization
          </p>
        </div>

        <div>

          {!isSignedIn ? (

            <SignInButton mode="modal">

              <button className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200">
                Sign In
              </button>

            </SignInButton>

          ) : (

            <UserButton />

          )}

        </div>

      </div>

      {/* MAIN GRID */}
      <div className="grid lg:grid-cols-2 gap-8">

        {/* LEFT PANEL */}
        <div className="bg-[#0f172a] border border-gray-800 rounded-3xl p-8">

          <div className="flex items-center gap-3 mb-6">
            <Upload size={30} />
            <h2 className="text-4xl font-bold">
              Upload Resume
            </h2>
          </div>

          <input
            type="file"
            accept=".pdf"
            onChange={(e) =>
              setFile(e.target.files?.[0] || null)
            }
            className="w-full bg-black border border-gray-700 p-4 rounded-xl mb-6"
          />

          <textarea
            placeholder="Paste Job Description Here..."
            value={jobDescription}
            onChange={(e) =>
              setJobDescription(e.target.value)
            }
            className="w-full h-52 bg-black border border-gray-700 p-4 rounded-xl mb-6"
          />

          <button
            onClick={uploadResume}
            disabled={loading}
            className="w-full bg-white text-black py-4 rounded-xl text-2xl font-bold hover:bg-gray-200 flex justify-center items-center gap-3"
          >

            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Resume"
            )}

          </button>

        </div>

        {/* RIGHT PANEL */}
        <div className="bg-[#0f172a] border border-gray-800 rounded-3xl p-8">

          <div className="flex items-center gap-3 mb-6">
            <FileText size={30} />
            <h2 className="text-4xl font-bold">
              AI Feedback
            </h2>
          </div>

          <div className="bg-black border border-gray-800 rounded-2xl p-6 min-h-[420px]">

            {feedback ? (

              <pre className="whitespace-pre-wrap text-lg text-gray-200">
                {feedback}
              </pre>

            ) : (

              <p className="text-gray-500 text-lg">
                Upload your resume and paste a job description.
              </p>

            )}

          </div>

        </div>

      </div>

      {/* ATS CARDS */}
      <div className="grid md:grid-cols-3 gap-6 mt-10">

        {/* SCORE */}
        <div className="bg-[#0f172a] border border-gray-800 rounded-3xl p-8 text-center">

          <h2 className="text-4xl font-bold mb-6">
            ATS Score
          </h2>

          <p className="text-7xl font-bold text-emerald-400">
            {atsScore}%
          </p>

        </div>

        {/* MATCHED */}
        <div className="bg-[#0f172a] border border-gray-800 rounded-3xl p-8">

          <h2 className="text-4xl font-bold mb-6">
            Matched Skills
          </h2>

          <div className="flex flex-wrap gap-3">

            {matchedSkills.map((skill, index) => (

              <span
                key={index}
                className="bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl"
              >
                {skill}
              </span>

            ))}

          </div>

        </div>

        {/* MISSING */}
        <div className="bg-[#0f172a] border border-gray-800 rounded-3xl p-8">

          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="text-red-400" />

            <h2 className="text-4xl font-bold">
              Missing Skills
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">

            {missingSkills.map((skill, index) => (

              <span
                key={index}
                className="bg-red-500/20 text-red-400 px-4 py-2 rounded-xl"
              >
                {skill}
              </span>

            ))}

          </div>

        </div>

      </div>

      {/* HISTORY */}
      <div className="mt-14">

        <h2 className="text-5xl font-bold mb-8">
          Resume History
        </h2>

        {history.length === 0 ? (

          <p className="text-gray-500 text-lg">
            No resume analysis history found.
          </p>

        ) : (

          <div className="grid lg:grid-cols-2 gap-6">

            {history.map((item: any, index) => (

              <div
                key={index}
                className="bg-[#0f172a] border border-gray-800 rounded-3xl p-8"
              >

                <h3 className="text-3xl font-bold text-emerald-400 mb-4">
                  ATS Score: {item.atsScore}%
                </h3>

                <div className="mb-4">

                  <p className="text-xl font-semibold mb-2">
                    Matched Skills
                  </p>

                  <div className="flex flex-wrap gap-2">

                    {item.matchedSkills.map(
                      (skill: string, i: number) => (

                        <span
                          key={i}
                          className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-xl"
                        >
                          {skill}
                        </span>

                      )
                    )}

                  </div>

                </div>

                <div className="mb-4">

                  <p className="text-xl font-semibold mb-2">
                    Missing Skills
                  </p>

                  <div className="flex flex-wrap gap-2">

                    {item.missingSkills.map(
                      (skill: string, i: number) => (

                        <span
                          key={i}
                          className="bg-red-500/20 text-red-400 px-3 py-1 rounded-xl"
                        >
                          {skill}
                        </span>

                      )
                    )}

                  </div>

                </div>

                <p className="text-gray-500 mt-6">
                  {new Date(item.createdAt).toLocaleString()}
                </p>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* FOOTER */}
      <footer className="text-center text-gray-500 mt-20 pb-10">
        Built with ❤️ using Next.js, Node.js, MongoDB & Clerk
      </footer>

    </main>
  );
}