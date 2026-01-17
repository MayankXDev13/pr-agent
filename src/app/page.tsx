import Link from "next/link";
import { FaGithub, FaCode, FaBolt, FaShieldAlt, FaUsers } from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black">
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <FaCode className="h-8 w-8" />
              <span className="text-xl font-bold">PR Agent</span>
            </div>
            <nav className="flex items-center space-x-4">
              <Link
                href="/login"
                className="px-4 py-2 bg-black text-white hover:bg-gray-800 rounded-md font-medium transition-colors"
              >
                Sign In
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-5xl font-bold tracking-tight mb-6">
            AI-Powered Code Reviews
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Automated code reviews powered by Llama 3.3 70B. Catch bugs, improve security, 
            and enforce code quality with every pull request.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/login"
              className="px-8 py-4 bg-black text-white hover:bg-gray-800 rounded-md text-lg font-medium transition-colors flex items-center space-x-2"
            >
              <FaGithub className="h-5 w-5" />
              <span>Sign in with GitHub</span>
            </Link>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border border-gray-200 rounded-lg">
              <FaBolt className="h-10 w-10 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-600">
                Real-time streaming reviews powered by Vercel AI SDK and OpenRouter.
              </p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg">
              <FaShieldAlt className="h-10 w-10 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Security First</h3>
              <p className="text-gray-600">
                Detect vulnerabilities and security issues before they reach production.
              </p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg">
              <FaUsers className="h-10 w-10 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Team Ready</h3>
              <p className="text-gray-600">
                Built for teams with admin controls, analytics, and audit logging.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>&copy; 2024 PR Agent. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
