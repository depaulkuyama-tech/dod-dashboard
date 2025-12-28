import { GetServerSideProps } from "next";
import { getCsrfToken, getSession } from "next-auth/react";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

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

    setError("");
    setSuccess("");

    // 1️⃣ Create Supabase Auth user
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          department: department,
          role: "pending",
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    // 2️⃣ Insert profile row for admin approval
    if (data.user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: data.user.id,
          full_name: fullName,
          email: email,
          department: department,
          approved: false,
        });

      if (profileError) {
        console.error(profileError);
        setError("Account created, but profile setup failed.");
        return;
      }
    }

    setSuccess(
      "Account created successfully. Please wait for administrator approval."
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
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative bg-white p-8 rounded shadow-lg w-full max-w-lg text-center z-10">
        <img
          src="/png-mod-logo.png"
          alt="PNG Ministry of Defence Logo"
          className="mx-auto mb-4 w-40 h-40 object-contain"
        />

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

          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="border rounded px-3 py-2"
          />

          <input
            type="email"
            placeholder="Official Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border rounded px-3 py-2"
          />

          <input
            type="text"
            placeholder="Department / Unit"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
            className="border rounded px-3 py-2"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border rounded px-3 py-2"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="border rounded px-3 py-2"
          />

          <button
            type="submit"
            className="bg-emerald-900 text-white py-2 rounded hover:bg-emerald-800"
          >
            Submit Registration
          </button>
        </form>

        <div className="mt-6 flex justify-between text-sm">
          <a href="/auth/signin" className="text-emerald-700 hover:underline">
            Back to Login
          </a>
          <a href="/" className="text-emerald-700 hover:underline">
            Back to Home
          </a>
        </div>

        <div className="mt-6 text-xs text-gray-600">
          Registration is restricted to authorized personnel only.
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
