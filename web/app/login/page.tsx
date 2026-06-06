"use client";

import toast from "react-hot-toast";
import { useState } from "react";

export default function Login() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const [loading, setLoading] =
useState(false);

const API =
process.env.NEXT_PUBLIC_API_URL;

const login = async () => {
try {
setLoading(true);


  const response =
    await fetch(
      `${API}/login`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

  const data =
    await response.json();

  if (data.success) {
    localStorage.setItem(
      "token",
      data.token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(
        data.user
      )
    );

    document.cookie =
      `token=${data.token}; path=/`;

    document.cookie =
      `user=${encodeURIComponent(
        JSON.stringify(
          data.user
        )
      )}; path=/`;

    toast.success(
      "Login Successful 🚀"
    );

    setTimeout(() => {
      window.location.href =
        "/";
    }, 500);
  } else {
    toast.error(
      data.message ||
        "Login Failed"
    );
  }
} catch (error) {
  console.log(error);

  toast.error(
    "Server Error"
  );
}

setLoading(false);


};

return ( <main className="min-h-screen bg-[#fffaf5] flex items-center justify-center px-6 py-16">


  <div className="w-full max-w-md bg-white rounded-[36px] shadow-2xl border border-orange-100 p-8 md:p-10">

    <div className="text-center mb-8">

      <h1 className="text-5xl font-black">
        <span className="text-orange-500">
          Job
        </span>
        <span className="text-gray-900">
          Hub
        </span>
      </h1>

      <p className="text-gray-500 mt-3">
        Welcome Back 👋
      </p>

    </div>

    <div className="space-y-5">

      <div>

        <label className="block mb-2 font-semibold text-gray-700">
          Email Address
        </label>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          className="w-full border border-orange-200 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
        />

      </div>

      <div>

        <label className="block mb-2 font-semibold text-gray-700">
          Password
        </label>

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          className="w-full border border-orange-200 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
        />

      </div>

      <button
        type="button"
        onClick={login}
        disabled={loading}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl text-lg font-bold transition-all duration-300 disabled:opacity-50"
      >
        {loading
          ? "Logging In..."
          : "Login 🚀"}
      </button>

    </div>

    <div className="mt-8 text-center">

      <p className="text-gray-500">
        Find jobs faster. Hire smarter.
      </p>

    </div>

  </div>

</main>


);
}
