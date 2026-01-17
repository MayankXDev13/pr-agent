"use client";

import { useState } from "react";
import { FaGithub } from "react-icons/fa";

import { authClient } from "../../../lib/auth-client";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGithubSignIn = async () => {
    setIsLoading(true);
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
      });
    } catch (error) {
      console.error("Sign in error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 overflow-hidden">
          <div className="p-8 sm:p-10">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center shadow-lg">
                <FaGithub className="w-8 h-8 text-white" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-center text-black mb-2 tracking-tight">
              Pr Agent
            </h1>

            <p className="text-center text-gray-500 mb-8 text-sm">
              AI-powered code review assistant
            </p>

            <button
              onClick={handleGithubSignIn}
              disabled={isLoading}
              className="w-full bg-black text-white font-medium py-3.5 px-4 rounded-xl hover:bg-gray-900 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <FaGithub className="w-5 h-5" />
              )}
              <span>Continue with GitHub</span>
            </button>
          </div>

          <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
            <p className="text-center text-xs text-gray-400">
              By continuing, you agree to our Terms of Service
            </p>
          </div>
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">
          Secure authentication powered by Better-Auth
        </p>
      </div>
    </div>
  );
}
