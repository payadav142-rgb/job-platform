"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {

const { token } = useParams();

const router = useRouter();

const [password, setPassword] =
useState("");

const [confirmPassword,
setConfirmPassword] =
useState("");

const handleReset =
async () => {

  if (
    password !==
    confirmPassword
  ) {

    alert(
      "Passwords do not match"
    );

    return;

  }

  const res =
    await fetch(
      "http://localhost:5000/reset-password",
      {

        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify({

            token,

            password

          })

      }
    );

  const data =
    await res.json();

  if (
    data.success
  ) {

    alert(
      "Password updated successfully"
    );

    router.push(
      "/login"
    );

  } else {

    alert(
      data.message ||
      "Something went wrong"
    );

  }

};


return (

<div className="max-w-md mx-auto mt-20 p-6 border rounded-lg">

  <h1 className="text-2xl font-bold mb-4">
    Reset Password
  </h1>

  <input
    type="password"
    placeholder="New Password"
    className="w-full border p-2 mb-3"
    value={password}
    onChange={(e) =>
      setPassword(
        e.target.value
      )
    }
  />

  <input
    type="password"
    placeholder="Confirm Password"
    className="w-full border p-2 mb-4"
    value={confirmPassword}
    onChange={(e) =>
      setConfirmPassword(
        e.target.value
      )
    }
  />

  <button
    onClick={
      handleReset
    }
    className="w-full bg-blue-600 text-white p-2 rounded"
  >
    Reset Password
  </button>

</div>

);

}
