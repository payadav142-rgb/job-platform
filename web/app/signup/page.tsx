"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {

const router = useRouter();

const [email, setEmail] =
useState("");

const [password, setPassword] =
useState("");

const [role, setRole] =
useState("candidate");

const [loading, setLoading] =
useState(false);

const signup = async () => {


if (!email || !password) {

  alert(
    "Please fill all fields"
  );

  return;

}

try {

  setLoading(true);

  const response =
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/signup`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          email,
          password,
          role
        })
      }
    );

  const data =
    await response.json();

  if (data.success) {

    alert(
      "Signup Successful 🚀"
    );

    router.push(
      "/login"
    );

  } else {

    alert(
      data.message ||
      "Signup Failed"
    );

  }

} catch (error) {

  console.log(error);

  alert(
    "Server Error"
  );

} finally {

  setLoading(false);

}


};

return (


<main className="min-h-screen bg-[#fffaf5] flex items-center justify-center px-6 py-16">

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
        Create Your Account 🚀
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
          className="w-full border border-orange-200 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
        />

      </div>

      <div>

        <label className="block mb-2 font-semibold text-gray-700">
          Password
        </label>

        <input
          type="password"
          placeholder="Create Password"
          className="w-full border border-orange-200 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
        />

      </div>

      <div>

        <label className="block mb-2 font-semibold text-gray-700">
          Account Type
        </label>

        <select
          value={role}
          className="w-full border border-orange-200 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
          onChange={(e) =>
            setRole(
              e.target.value
            )
          }
        >
          <option value="candidate">
            Candidate
          </option>

          <option value="recruiter">
            Recruiter
          </option>

        </select>

      </div>

      <button
        onClick={signup}
        disabled={loading}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl text-lg font-bold transition-all duration-300 disabled:opacity-50"
      >

        {loading
          ? "Creating Account..."
          : "Create Account 🚀"}

      </button>

    </div>

    <div className="mt-8 text-center">

      <p className="text-gray-500">
        Join thousands of candidates and recruiters.
      </p>

    </div>

  </div>

</main>


);

}
