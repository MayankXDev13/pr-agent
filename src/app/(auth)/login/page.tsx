"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Github, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to Better Auth sign-in page
    const signIn = async () => {
      try {
        const response = await fetch("/api/auth/signin/github", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.redirect) {
            window.location.href = data.redirect;
          }
        }
      } catch (error) {
        console.error("Sign in error:", error);
      }
    };

    signIn();
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md w-full p-8 border border-gray-200 rounded-lg text-center">
        <Github className="h-12 w-12 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Signing you in</h1>
        <p className="text-gray-600 mb-6">
          Redirecting to GitHub...
        </p>
        <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" />
      </div>
    </div>
  );
}
