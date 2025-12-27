// src/pages/auth/signup.tsx
import { GetServerSideProps } from "next";
import { getCsrfToken, getSession } from "next-auth/react";
import { useState } from "react";

interface SignUpProps {
  csrfToken: string | null;
}

export default function SignUp({ csrfToken }: SignUpProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // TODO: Connect to backend API (e.g. /api/auth/signup)
    setError("");
    setSuccess(
      "Account request submitted. Please wait for administrator approval."
    );
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundImage: "url('/login-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Signup Card */}
      <div className="relative bg-white p-8 rounded shadow-lg w-full max-w-lg text-center z-10">
        {/* Logo */}
        <img
          src="/png-mod-logo.png"
          alt="PNG Ministry of Defence Logo"
          className="mx-auto mb-4 w-40 h-40 object-contain"
        />

        {/* Government Name */}
        <h3 className="text-2xl font-extrabold tracking-widest uppercase text-emerald-900">
          Papua New Guinea
        </h3>
        <h3 className="text-xl font-bold tracking-wide uppercase text-emerald-800 mt-1">
          Ministry of Defence
        </h3>

        <div className="w-full h-1 bg-emerald-900 my-6"></div>

        <h1 className="text-2xl font-bold mb-6 text-emerald-900">
          Account Registration
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-100 text-emerald-800 p-2 mb-4 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {csrfToken && (
            <input type="hidden" name="csrfToken" value={csrfToken} />
          )}

          <label className="flex flex-col text-left">
            <span className="mb-1 font-semibold text-emerald-900">
              Full Name
            </span>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="John Michael Doe"
              className="border border-emerald-300 rounded px-3 py-2 focus:ring-2 focus:ring-emerald-600"
            />
          </label>

          <label className="flex flex-col text-left">
            <span className="mb-1 font-semibold text-emerald-900">
              Official Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@defence.gov.pg"
              className="border border-emerald-300 rounded px-3 py-2 focus:ring-2 focus:ring-emerald-600"
            />
          </label>

          <label className="flex flex-col text-left">
            <span className="mb-1 font-semibold text-emerald-900">
              Department / Unit
            </span>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
              placeholder="Infantry / Finance / Logistics"
              className="border border-emerald-300 rounded px-3 py-2 focus:ring-2 focus:ring-emerald-600"
            />
          </label>

          <label className="flex flex-col text-left">
            <span className="mb-1 font-semibold text-emerald-900">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-emerald-300 rounded px-3 py-2 focus:ring-2 focus:ring-emerald-600"
            />
          </label>

          <label className="flex flex-col text-left">
            <span className="mb-1 font-semibold text-emerald-900">
              Confirm Password
            </span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="border border-emerald-300 rounded px-3 py-2 focus:ring-2 focus:ring-emerald-600"
            />
          </label>

          <button
            type="submit"
            className="bg-emerald-900 text-white py-2 rounded hover:bg-emerald-800 transition"
          >
            Submit Registration
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 flex justify-between text-sm">
          <a href="/auth/signin" className="text-emerald-700 hover:underline">
            Back to Login
          </a>
          <a href="/" className="text-emerald-700 hover:underline">
            Back to Home
          </a>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-xs text-gray-600">
          Registration is restricted to authorized personnel only. All account
          requests are reviewed and approved by system administrators.
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-4 border-t text-xs text-gray-500 text-center">
          © {new Date().getFullYear()} Government of Papua New Guinea – Ministry of
          Defence.
          <br />
          
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: { destination: "/", permanent: false },
    };
  }

  const csrfToken = await getCsrfToken(context);

  return {
    props: {
      csrfToken: csrfToken ?? null,
    },
  };
};
