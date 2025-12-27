// src/pages/index.tsx
import React from "react";
import {
  FaTachometerAlt,
  FaUsers,
  FaFileAlt,
  FaCog,
  FaShieldAlt,
  FaFileInvoiceDollar,
  FaSignOutAlt,
} from "react-icons/fa";
import { getSession, signOut } from "next-auth/react";

const payslips = [
  {
    period: "December 2025",
    name: "Sgt. John Doe",
    rank: "Sergeant",
    employeeId: "PNGD-00123",
    department: "Infantry",
    basic: 10000,
    allowances: 2500,
    deductions: 1200,
  },
  {
    period: "November 2025",
    name: "Sgt. John Doe",
    rank: "Sergeant",
    employeeId: "PNGD-00123",
    department: "Infantry",
    basic: 10000,
    allowances: 2500,
    deductions: 1000,
  },
];

export default function Dashboard({ session }: { session: any }) {
  return (
    <div className="flex min-h-screen bg-zinc-100">
      {/* Sidebar */}
      <aside className="w-64 bg-emerald-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-emerald-800">
          PNG DoD
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <a
            href="#"
            className="flex items-center gap-3 p-2 rounded hover:bg-emerald-800 transition-colors"
          >
            <FaTachometerAlt /> Dashboard
          </a>
          <a
            href="#"
            className="flex items-center gap-3 p-2 rounded hover:bg-emerald-800 transition-colors"
          >
            <FaUsers /> Personnel
          </a>
          <a
            href="#"
            className="flex items-center gap-3 p-2 rounded hover:bg-emerald-800 transition-colors"
          >
            <FaFileAlt /> Reports
          </a>
          <a
            href="#"
            className="flex items-center gap-3 p-2 rounded hover:bg-emerald-800 transition-colors"
          >
            <FaShieldAlt /> Security
          </a>
          <a
            href="#"
            className="flex items-center gap-3 p-2 rounded hover:bg-emerald-800 transition-colors"
          >
            <FaCog /> Settings
          </a>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-emerald-700 shadow px-6 py-4 flex justify-between items-center text-white">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span>{session.user?.name || "Admin Officer"}</span>
            <img
              className="w-10 h-10 rounded-full border-2 border-white"
              src="/profile-placeholder.png"
              alt="Profile"
            />
            <button
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              className="flex items-center gap-1 bg-red-600 px-3 py-1 rounded hover:bg-red-500 transition-colors"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Example cards */}
          <div className="bg-emerald-100 text-emerald-900 shadow rounded p-6">
            <h2 className="text-lg font-semibold mb-2">Total Personnel</h2>
            <p className="text-3xl font-bold">1,245</p>
          </div>
          <div className="bg-emerald-100 text-emerald-900 shadow rounded p-6">
            <h2 className="text-lg font-semibold mb-2">Active Operations</h2>
            <p className="text-3xl font-bold">12</p>
          </div>

          {/* Payslip section */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-emerald-100 text-emerald-900 shadow rounded p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaFileInvoiceDollar /> Payslips
            </h2>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-emerald-200">
                  <th className="p-2 border border-emerald-300">Period</th>
                  <th className="p-2 border border-emerald-300">Basic Pay</th>
                  <th className="p-2 border border-emerald-300">Allowances</th>
                  <th className="p-2 border border-emerald-300">Deductions</th>
                  <th className="p-2 border border-emerald-300">Net Pay</th>
                  <th className="p-2 border border-emerald-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {payslips.map((p, idx) => (
                  <tr key={idx} className="odd:bg-emerald-100 even:bg-emerald-50">
                    <td className="p-2 border border-emerald-300">{p.period}</td>
                    <td className="p-2 border border-emerald-300">K{p.basic.toLocaleString()}</td>
                    <td className="p-2 border border-emerald-300">
                      K{p.allowances.toLocaleString()}
                    </td>
                    <td className="p-2 border border-emerald-300">
                      K{p.deductions.toLocaleString()}
                    </td>
                    <td className="p-2 border border-emerald-300">
                      K{(p.basic + p.allowances - p.deductions).toLocaleString()}
                    </td>
                    <td className="p-2 border border-emerald-300">
                      <button className="bg-emerald-900 text-white px-3 py-1 rounded hover:bg-emerald-800 transition-colors">
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

// -------------------- LOGIN PROTECTION --------------------
export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
