"use client";

import {
  useEffect,
  useState
} from "react";

export default function SavedJobs() {

  const [savedJobs, setSavedJobs] =
    useState<any[]>([]);

  useEffect(() => {

    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/saved-jobs/${user.id}`
    )
      .then((res) => res.json())
      .then((data) =>
        setSavedJobs(data)
      );

  }, []);

  return (

    <main className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-4xl font-bold mb-10">
        Saved Jobs ❤️
      </h1>

      <div className="grid gap-6">

        {savedJobs.map((job: any) => (

          <div
            key={job.id}
            className="bg-white p-6 rounded-2xl shadow"
          >

            <h2 className="text-2xl font-bold">
              {job.jobs?.title}
            </h2>

            <p className="mt-3">
              {job.jobs?.description}
            </p>

            <p className="mt-3">
              📍 {job.jobs?.location}
            </p>

            <p>
              💰 ₹{job.jobs?.salary}
            </p>

          </div>

        ))}

      </div>

    </main>

  );
}