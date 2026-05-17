"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
const updateStatus = async (
  applicationId: string,
  status: string
) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications/${applicationId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status })
    }
  );

  const data = await response.json();

  if (data.success) {
    alert(`Candidate ${status}`);
    window.location.reload();
  }
};
const uploadResume = async (
  e: any
) => {
  const file = e.target.files[0];

  const formData = new FormData();

  formData.append("resume", file);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/upload-resume`,
    {
      method: "POST",
      body: formData
    }
  );

  const data = await response.json();

  if (data.success) {
    alert("Resume Uploaded 🚀");
  } else {
    alert("Upload Failed");
  }
};
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`)
      .then((res) => res.json())
      .then((data) => setJobs(data));

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications`)
  .then((res) => res.json())
  .then((data) => setApplications(data));
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-4xl font-bold mb-10">
        Recruitment Platform 🚀
      </h1>

      <h2 className="text-3xl font-bold mb-5">
        Posted Jobs
      </h2>

      <div className="grid gap-6 mb-12">
        {jobs.map((job: any) => (
          <div
            key={job.id}
            className="bg-white p-6 rounded-2xl shadow"
          >
            <h2 className="text-2xl font-bold">
              {job.title}
            </h2>

            <p className="text-gray-600 mt-2">
              {job.description}
            </p>

            <p className="mt-3">
              📍 {job.location}
            </p>

            <p>
              💰 ₹{job.salary}
            </p>
          </div>
        ))}
      </div>
<div className="mb-10">
  <input
    type="file"
    onChange={uploadResume}
    className="mb-5"
  />
</div>
      <h2 className="text-3xl font-bold mb-5">
        Applicants
      </h2>

      <div className="grid gap-6">
        {applications.map((app: any) => (
          <div
            key={app.id}
            className="bg-white p-6 rounded-2xl shadow"
          >
            <p className="text-xl font-semibold">
              👤 {app.users?.email}
            </p>

            <p className="mt-2">
              Applied For:
              <span className="font-bold">
                {" "}
                {app.jobs?.title}
              </span>
            </p>
            <p className="mt-2">
  Status:
  <span className="font-bold">
    {" "}
    {app.status || "Applied"}
  </span>
</p>

<div className="flex gap-3 mt-4">
  <button
    onClick={() =>
      updateStatus(app.id, "Shortlisted")
    }
    className="bg-green-600 text-white px-4 py-2 rounded-xl"
  >
    Shortlist
  </button>

  <button
    onClick={() =>
      updateStatus(app.id, "Rejected")
    }
    className="bg-red-600 text-white px-4 py-2 rounded-xl"
  >
    Reject
  </button>
</div>
          </div>
        ))}
      </div>
    </main>
  );
}