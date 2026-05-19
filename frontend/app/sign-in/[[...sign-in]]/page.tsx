"use client";

import { SignIn } from "@clerk/nextjs";

export default function Page() {

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-6">

      <div className="w-full max-w-md">

        <div className="text-center mb-8">

          <h1 className="text-5xl font-extrabold text-white mb-3">
            ResumeIQ AI 🚀
          </h1>

          <p className="text-gray-400">
            AI-Powered ATS Resume Analyzer
          </p>

        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">

          <SignIn
            routing="path"
            path="/sign-in"
          />

        </div>

      </div>

    </main>
  );
}