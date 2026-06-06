"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {

const [email, setEmail] =
useState("");

const [loading, setLoading] =
useState(false);

const handleSubmit =
  async (
    e: React.FormEvent<HTMLFormElement>
  ) => {


  e.preventDefault();

  setLoading(true);

  try {

    const res =
      await fetch(
        "http://localhost:5000/forgot-password",
        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify({
              email
            })

        }
      );

    const data =
      await res.json();

    if (
      data.success
    ) {

      alert(
        "Reset link sent to your email"
      );

      setEmail("");

    } else {

      alert(
        data.message ||
        "Something went wrong"
      );

    }

  } catch (error) {

    console.log(error);

    alert(
      "Server error"
    );

  }

  setLoading(false);

};


return (


<div className="max-w-md mx-auto mt-20 p-6 border rounded-lg">

  <h1 className="text-2xl font-bold mb-6">
    Forgot Password
  </h1>

  <form
    onSubmit={
      handleSubmit
    }
  >

    <input
      type="email"
      placeholder="Enter your email"
      className="w-full border p-2 mb-4"
      value={email}
      onChange={(e) =>
        setEmail(
          e.target.value
        )
      }
      required
    />

    <button
      type="submit"
      disabled={loading}
      className="w-full bg-blue-600 text-white p-2 rounded"
    >

      {loading
        ? "Sending..."
        : "Send Reset Link"}

    </button>

  </form>

</div>


);

}
