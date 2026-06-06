"use client";

import { useEffect, useState } from "react";

export default function PostJob() {
const [authorized, setAuthorized] = useState(false);

const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
const [location, setLocation] = useState("");
const [salary, setSalary] = useState("");

const [isPremium, setIsPremium] = useState(false);

useEffect(() => {
const user = JSON.parse(
localStorage.getItem("user") || "{}"
);


if (user.role === "recruiter") {
  setAuthorized(true);
  setIsPremium(user.isPremium || false);
} else {
  alert("Recruiters Only");
  window.location.href = "/";
}


}, []);

const postJob = async () => {
try {
const user = JSON.parse(
localStorage.getItem("user") || "{}"
);


  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/jobs`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem(
          "token"
        )}`,
      },
      body: JSON.stringify({
        title,
        description,
        location,
        salary,
        recruiter_id: user.id,
      }),
    }
  );

  const data = await response.json();

  if (!data.success) {
    if (
      data.message ===
      "Upgrade To Premium To Post More Jobs 👑"
    ) {
      alert("Upgrade To Premium 👑");
      window.location.href = "/premium";
      return;
    }

    alert(data.message || "Failed");
    return;
  }

  alert("Job Posted Successfully 🚀");

  setTitle("");
  setDescription("");
  setLocation("");
  setSalary("");
} catch (error) {
  console.log(error);
  alert("Server Error");
}


};

if (!authorized) {
return null;
}

return ( <main className="min-h-screen bg-[#fffaf5] px-6 py-16"> <div className="max-w-5xl mx-auto">


    <div className="text-center mb-14">
      <h1 className="text-5xl md:text-7xl font-black leading-tight">
        <span className="text-orange-500">
          Post Your
        </span>
        <br />
        Next Great Job
      </h1>

      <p className="text-gray-600 text-lg mt-6 max-w-2xl mx-auto">
        Reach thousands of talented candidates and hire
        faster with JobHub.
      </p>

      {isPremium ? (
        <div className="inline-flex mt-6 bg-orange-100 text-orange-600 px-5 py-2 rounded-full font-semibold">
          Premium Recruiter 👑
        </div>
      ) : (
        <div className="inline-flex mt-6 bg-red-100 text-red-500 px-5 py-2 rounded-full font-semibold">
          Free Plan • Only 1 Job Allowed
        </div>
      )}
    </div>

    <div className="bg-white rounded-[40px] shadow-2xl border border-orange-100 p-8 md:p-12">

      <div className="grid md:grid-cols-2 gap-6">

        <div className="md:col-span-2">
          <label className="font-semibold text-gray-700">
            Job Title
          </label>

          <input
            type="text"
            placeholder="Frontend Developer"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            className="mt-2 w-full border border-orange-200 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="font-semibold text-gray-700">
            Job Description
          </label>

          <textarea
            placeholder="Write complete job description..."
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            className="mt-2 w-full border border-orange-200 rounded-2xl px-5 py-4 min-h-[180px] outline-none focus:border-orange-500"
          />
        </div>

        <div>
          <label className="font-semibold text-gray-700">
            Location
          </label>

          <input
            type="text"
            placeholder="Delhi, India"
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
            className="mt-2 w-full border border-orange-200 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
          />
        </div>

        <div>
          <label className="font-semibold text-gray-700">
            Salary
          </label>

          <input
            type="text"
            placeholder="₹ 12 LPA"
            value={salary}
            onChange={(e) =>
              setSalary(e.target.value)
            }
            className="mt-2 w-full border border-orange-200 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
          />
        </div>

      </div>

      <button
        onClick={postJob}
        className="mt-10 w-full bg-orange-500 hover:bg-orange-600 text-white py-5 rounded-2xl text-lg font-bold transition-all"
      >
        🚀 Post Job
      </button>

    </div>
  </div>
</main>


);
}
