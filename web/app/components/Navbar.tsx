"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
const [open, setOpen] = useState(false);
const [user, setUser] = useState<any>(null);
const [dark, setDark] = useState(false);

useEffect(() => {
const theme = localStorage.getItem("theme");


if (theme === "dark") {
  document.documentElement.classList.add("dark");
  setDark(true);
}

const storedUser = localStorage.getItem("user");

if (storedUser) {
  setUser(JSON.parse(storedUser));
}


}, []);

const toggleDarkMode = () => {
if (dark) {
document.documentElement.classList.remove("dark");
localStorage.setItem("theme", "light");
} else {
document.documentElement.classList.add("dark");
localStorage.setItem("theme", "dark");
}


setDark(!dark);


};

const logout = () => {
localStorage.removeItem("token");
localStorage.removeItem("user");
window.location.href = "/login";
};

return ( <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-orange-100 shadow-sm"> <div className="max-w-7xl mx-auto px-6 py-5"> <div className="flex justify-between items-center">
{/* Logo */} <div className="flex items-center gap-3"> <Link href="/"> <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight cursor-pointer"> <span className="text-orange-500">Job</span> <span className="text-gray-900">Hub</span> </h1> </Link>


        {user?.role === "recruiter" && (
          <span className="bg-orange-100 text-orange-600 text-xs px-3 py-1 rounded-full font-semibold">
            PREMIUM
          </span>
        )}
      </div>

      {/* Mobile Button */}
      <button
        className="md:hidden text-2xl border border-orange-200 text-orange-500 px-3 py-1 rounded-xl"
        onClick={() => setOpen(!open)}
      >
        {open ? "✕" : "☰"}
      </button>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-6 items-center text-[15px] font-medium text-gray-700">
        <Link
          href={user?.role === "recruiter" ? "/recruiter" : "/"}
          className="hover:text-orange-500 transition"
        >
          Home
        </Link>

        {user?.role === "candidate" && (
          <>
            <Link
              href="/candidate"
              className="hover:text-orange-500 transition"
            >
              Candidate
            </Link>

            <Link
              href="/saved-jobs"
              className="hover:text-orange-500 transition"
            >
              Saved Jobs
            </Link>

            <Link
              href="/my-applications"
              className="hover:text-orange-500 transition"
            >
              Applications
            </Link>
          </>
        )}

        {user?.role === "recruiter" && (
          <>
            <Link
              href="/recruiter-dashboard"
              className="hover:text-orange-500 transition"
            >
              Dashboard
            </Link>

            <Link
              href="/post-job"
              className="hover:text-orange-500 transition"
            >
              Post Job
            </Link>

            <Link
  href="/recruiter/applications"
  className="hover:text-orange-500 transition"
>
  Applicants
</Link>

            <Link
              href="/premium"
              className="text-orange-500 font-semibold hover:text-orange-600 transition"
            >
              Premium 👑
            </Link>
          </>
        )}

        {user && (
          <>
            <button
              onClick={toggleDarkMode}
              className="border border-gray-200 px-4 py-2 rounded-xl hover:bg-orange-50 transition"
            >
              {dark ? "☀️" : "🌙"}
            </button>

            <button
              onClick={logout}
              className="bg-orange-500 text-white px-5 py-2 rounded-xl hover:bg-orange-600 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>

    {/* Mobile Menu */}
    {open && (
      <div className="md:hidden mt-5 flex flex-col gap-3 bg-white border border-orange-100 shadow-xl rounded-2xl p-5 text-gray-700">
        <Link
          href={user?.role === "recruiter" ? "/recruiter-dashboard" : "/"}
          onClick={() => setOpen(false)}
          className="hover:text-orange-500 transition"
        >
          Home
        </Link>

        {user?.role === "candidate" && (
          <>
            <Link
              href="/candidate"
              onClick={() => setOpen(false)}
              className="hover:text-orange-500 transition"
            >
              Candidate
            </Link>

            <Link
              href="/saved-jobs"
              onClick={() => setOpen(false)}
              className="hover:text-orange-500 transition"
            >
              Saved Jobs
            </Link>

            <Link
              href="/my-applications"
              onClick={() => setOpen(false)}
              className="hover:text-orange-500 transition"
            >
              Applications
            </Link>
          </>
        )}

        {user?.role === "recruiter" && (
          <>
            <Link
              href="/recruiter"
              onClick={() => setOpen(false)}
              className="hover:text-orange-500 transition"
            >
              Dashboard
            </Link>

            <Link
              href="/post-job"
              onClick={() => setOpen(false)}
              className="hover:text-orange-500 transition"
            >
              Post Job
            </Link>

            <Link
  href="/recruiter/applications"
  onClick={() => setOpen(false)}
  className="hover:text-orange-500 transition"
>
  Applicants
</Link>

            <Link
              href="/premium"
              onClick={() => setOpen(false)}
              className="text-orange-500 font-semibold"
            >
              Premium 👑
            </Link>
          </>
        )}

        {user && (
          <>
            <button
              onClick={toggleDarkMode}
              className="border border-gray-200 py-2 rounded-xl"
            >
              {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>

            <button
              onClick={logout}
              className="bg-orange-500 text-white py-2 rounded-xl hover:bg-orange-600 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    )}
  </div>
</nav>


);
}
