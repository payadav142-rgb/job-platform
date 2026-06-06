"use client";

import {
  useEffect,
  useState
} from "react";

import { useRouter }
from "next/navigation";

export default function CandidateDashboard() {

  const router =
    useRouter();

  const [applications, setApplications] =
    useState<any[]>([]);

  const [savedJobs, setSavedJobs] =
    useState<any[]>([]);

  const [user, setUser] =
    useState<any>(null);

  useEffect(() => {

    const token =
      localStorage.getItem("token");

    if (!token) {

      router.push("/login");

      return;

    }

    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {

      const parsedUser =
        JSON.parse(storedUser);

      setUser(parsedUser);

      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/my-applications/${parsedUser.id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      )
        .then((res) => res.json())
        .then((data) => {

          if (
            Array.isArray(data)
          ) {

            setApplications(data);

          }

        });

      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/saved-jobs/${parsedUser.id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      )
        .then((res) => res.json())
        .then((data) => {

          if (
            Array.isArray(data)
          ) {

            setSavedJobs(data);

          }

        });

    }

  }, []);

  return (

    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-10">

      <h1 className="text-4xl font-bold mb-10 text-gray-800">
        Candidate Dashboard 🚀
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        <div className="bg-blue-500 text-white p-6 rounded-2xl shadow">

          <h2 className="text-xl font-semibold">
            Applications
          </h2>

          <p className="text-4xl font-bold mt-2">
            {applications.length}
          </p>

        </div>

        <div className="bg-pink-500 text-white p-6 rounded-2xl shadow">

          <h2 className="text-xl font-semibold">
            Saved Jobs
          </h2>

          <p className="text-4xl font-bold mt-2">
            {savedJobs.length}
          </p>

        </div>

        <div className="bg-green-500 text-white p-6 rounded-2xl shadow">

          <h2 className="text-xl font-semibold">
            Resume Status
          </h2>

          <p className="text-2xl font-bold mt-2">

            {user?.resume
              ? "Uploaded ✅"
              : "Missing ❌"}

          </p>

        </div>

      </div>

      <div className="bg-white p-6 rounded-2xl shadow mb-10">

        <h2 className="text-2xl font-bold mb-4">
          Profile
        </h2>

        <p className="text-gray-700">
          Email: {user?.email}
        </p>

        <p className="mt-2 text-gray-700">

          Resume:{" "}

          {user?.resume
            ? "Uploaded ✅"
            : "Not Uploaded ❌"}

        </p>

      </div>

      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Applied Jobs
      </h2>

      <div className="grid gap-6 mb-10">

        {applications.length === 0 && (

          <div className="bg-white p-6 rounded-2xl shadow text-center">

            <p className="text-gray-500">
              No applications yet 😔
            </p>

          </div>

        )}

        {applications.map((app: any) => (

          <div
            key={app.id}
            className="bg-white p-6 rounded-2xl shadow"
          >

            <h3 className="text-2xl font-bold text-gray-800">
              {app.jobs?.title}
            </h3>

            <p className="mt-3 text-gray-700">

              Status:{" "}

              <span className="font-semibold">
                {app.status}
              </span>

            </p>

          </div>

        ))}

      </div>

      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Saved Jobs ❤️
      </h2>

      <div className="grid gap-6">

        {savedJobs.length === 0 && (

          <div className="bg-white p-6 rounded-2xl shadow text-center">

            <p className="text-gray-500">
              No saved jobs yet ❤️
            </p>

          </div>

        )}

        {savedJobs.map((job: any) => (

          <div
            key={job.id}
            className="bg-white p-6 rounded-2xl shadow"
          >

            <h3 className="text-2xl font-bold text-gray-800">
              {job.jobs?.title}
            </h3>

            <p className="mt-3 text-gray-600">
              {job.jobs?.description}
            </p>

          </div>

        ))}

      </div>

    </main>

  );

}