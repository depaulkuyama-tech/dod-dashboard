// src/pages/auth/signin.tsx
import { GetServerSideProps } from "next";
import { getCsrfToken, getSession, signIn } from "next-auth/react";
import { useState } from "react";

interface SignInProps {
  csrfToken: string | null;
}

export default function SignIn({ csrfToken }: SignInProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid credentials. Please try again.");
    } else {
      window.location.href = "/";
    }
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

      {/* Login Card */}
      <div className="relative bg-white p-8 rounded shadow-lg w-full max-w-md text-center z-10">
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
          Secure Login
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {csrfToken && (
            <input type="hidden" name="csrfToken" value={csrfToken} />
          )}

          <label className="flex flex-col text-left">
            <span className="mb-1 font-semibold text-emerald-900">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="border border-emerald-300 rounded px-3 py-2 focus:ring-2 focus:ring-emerald-600"
            />
          </label>

          <label className="flex flex-col text-left">
            <span className="mb-1 font-semibold text-emerald-900">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="border border-emerald-300 rounded px-3 py-2 focus:ring-2 focus:ring-emerald-600"
            />
          </label>

          <button
            type="submit"
            className="bg-emerald-900 text-white py-2 rounded hover:bg-emerald-800 transition"
          >
            Sign In
          </button>
        </form>

        {/* Links */}
        <div className="mt-4 flex justify-between text-sm">
          <a
            href="/auth/forgot-password"
            className="text-emerald-700 hover:underline"
          >
            Forgot password?
          </a>
          <a href="/" className="text-emerald-700 hover:underline">
            Back to Home
          </a>
        </div>

        <p className="mt-6 text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <a href="/auth/signup" className="text-emerald-700 hover:underline">
            Sign Up
          </a>
        </p>

        {/* Copyright */}
        <div className="mt-8 pt-4 border-t text-xs text-gray-500 text-center">
          © {new Date().getFullYear()} Government of Papua New Guinea – Ministry of
          Defence.
          <br />
          Unauthorized access is prohibited.
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
