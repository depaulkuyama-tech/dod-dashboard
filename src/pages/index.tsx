// src/pages/index.tsx
import React, { useEffect, useState } from "react";
import {
  FaTachometerAlt,
  FaUsers,
  FaFileAlt,
  FaCog,
  FaShieldAlt,
  FaFileInvoiceDollar,
  FaSignOutAlt,
} from "react-icons/fa";
import { GetServerSideProps } from "next";
import { supabase } from "../lib/supabaseClient";

type Payslip = {
  id: string;
  period: string;
  basic: number;
  allowances: number;
  deductions: number;
};

export default function Dashboard({ user }: { user: any }) {
  const [payslips, setPayslips] = useState<Payslip[]>([]);

  // -------------------- LOAD USER DATA --------------------
  useEffect(() => {
    const fetchPayslips = async () => {
      const { data, error } = await supabase
        .from("payslips")
        .select("*")
        .order("period", { ascending: false });

      if (!error && data) {
        setPayslips(data);
      }
    };

    fetchPayslips();
  }, []);

  // -------------------- LOGOUT --------------------
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/auth/signin";
  };

  return (
    <div className="flex min-h-screen bg-zinc-100">
      {/* Sidebar */}
      <aside className="w-64 bg-emerald-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-emerald-800">
          PNG DoD
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <a className="flex items-center gap-3 p-2 rounded hover:bg-emerald-800">
            <FaTachometerAlt /> Dashboard
          </a>
          <a className="flex items-center gap-3 p-2 rounded hover:bg-emerald-800">
            <FaUsers /> Personnel
          </a>
          <a className="flex items-center gap-3 p-2 rounded hover:bg-emerald-800">
            <FaFileAlt /> Reports
          </a>
          <a className="flex items-center gap-3 p-2 rounded hover:bg-emerald-800">
            <FaShieldAlt /> Security
          </a>
          <a className="flex items-center gap-3 p-2 rounded hover:bg-emerald-800">
            <FaCog /> Settings
          </a>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-emerald-700 px-6 py-4 flex justify-between items-center text-white">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span>{user.email}</span>
            <img
              className="w-10 h-10 rounded-full border-2 border-white"
              src="/profile-placeholder.png"
              alt="Profile"
            />
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 bg-red-600 px-3 py-1 rounded hover:bg-red-500"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-emerald-100 shadow rounded p-6">
            <h2 className="text-lg font-semibold mb-2">Total Personnel</h2>
            <p className="text-3xl font-bold">—</p>
          </div>

          <div className="bg-emerald-100 shadow rounded p-6">
            <h2 className="text-lg font-semibold mb-2">Active Operations</h2>
            <p className="text-3xl font-bold">—</p>
          </div>

          {/* Payslips */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-emerald-100 shadow rounded p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaFileInvoiceDollar /> Payslips
            </h2>

            {payslips.length === 0 ? (
              <p>No payslips available.</p>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-emerald-200">
                    <th className="p-2 border">Period</th>
                    <th className="p-2 border">Basic</th>
                    <th className="p-2 border">Allowances</th>
                    <th className="p-2 border">Deductions</th>
                    <th className="p-2 border">Net Pay</th>
                  </tr>
                </thead>
                <tbody>
                  {payslips.map((p) => (
                    <tr key={p.id} className="odd:bg-emerald-50">
                      <td className="p-2 border">{p.period}</td>
                      <td className="p-2 border">K{p.basic.toLocaleString()}</td>
                      <td className="p-2 border">
                        K{p.allowances.toLocaleString()}
                      </td>
                      <td className="p-2 border">
                        K{p.deductions.toLocaleString()}
                      </td>
                      <td className="p-2 border font-bold">
                        K
                        {(p.basic +
                          p.allowances -
                          p.deductions).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// -------------------- SERVER-SIDE AUTH --------------------
export const getServerSideProps: GetServerSideProps = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: session.user,
    },
  };
};
