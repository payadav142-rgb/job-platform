"use client";

import {
  useEffect,
  useState
} from "react";

import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

export default function RecruiterDashboard() {

  const router = useRouter();

  const API =
    process.env.NEXT_PUBLIC_API_URL;

  const [jobs, setJobs] =
    useState<any[]>([]);

  const [applications, setApplications] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const token =
      localStorage.getItem("token");

    const storedUser =
      localStorage.getItem("user");

    if (
      !token ||
      !storedUser
    ) {

      router.push("/login");

      return;

    }

    const user =
      JSON.parse(storedUser);

    if (
      user.role !== "recruiter"
    ) {

      toast.error(
        "Recruiter Access Only"
      );

      router.push("/");

      return;

    }

    fetchJobs(user.id);

    fetchApplications();

  }, []);

  const fetchJobs =
    async (
      recruiterId: string
    ) => {

      try {

        const response =
          await fetch(
            `${API}/my-jobs/${recruiterId}`,
            {
              headers: {
                Authorization:
                  `Bearer ${localStorage.getItem("token")}`
              }
            }
          );

        const data =
          await response.json();

        if (Array.isArray(data)) {

          setJobs(data);

        } else {

          setJobs([]);

        }

      } catch {

        toast.error(
          "Failed To Load Jobs"
        );

      }

      setLoading(false);

    };

  const fetchApplications =
    async () => {

      try {

        const response =
          await fetch(
            `${API}/applications`,
            {
              headers: {
                Authorization:
                  `Bearer ${localStorage.getItem("token")}`
              }
            }
          );

        const data =
          await response.json();

        if (Array.isArray(data)) {

          setApplications(data);

        } else {

          setApplications([]);

        }

      } catch {

        toast.error(
          "Failed To Load Applications"
        );

      }

    };

  const updateStatus =
    async (
      id: number,
      status: string
    ) => {

      try {

        const response =
          await fetch(
            `${API}/applications/${id}`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${localStorage.getItem("token")}`
              },

              body: JSON.stringify({
                status
              })
            }
          );

        const data =
          await response.json();

        if (data.success) {

          toast.success(
            `Application ${status}`
          );

          fetchApplications();

        }

      } catch {

        toast.error(
          "Server Error"
        );

      }

    };

  const deleteJob =
    async (id: number) => {

      try {

        const response =
          await fetch(
            `${API}/jobs/${id}`,
            {
              method: "DELETE",

              headers: {
                Authorization:
                  `Bearer ${localStorage.getItem("token")}`
              }
            }
          );

        const data =
          await response.json();

        if (data.success) {

          toast.success(
            "Job Deleted"
          );

          const updated =
            jobs.filter(
              (job) =>
                job.id !== id
            );

          setJobs(updated);

        }

      } catch {

        toast.error(
          "Delete Failed"
        );

      }

    };

  return (

    <main className="min-h-screen bg-gray-100 dark:bg-black dark:text-white p-4 md:p-10">

      <h1 className="text-4xl md:text-6xl font-black mb-10">
        Recruiter Dashboard 🚀
      </h1>

      {loading && (

        <p>
          Loading...
        </p>

      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow">

          <h2 className="text-4xl font-black text-blue-600">
            {jobs.length}
          </h2>

          <p className="mt-2">
            Total Jobs
          </p>

        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow">

          <h2 className="text-4xl font-black text-green-600">
            {applications.length}
          </h2>

          <p className="mt-2">
            Applications
          </p>

        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow">

          <h2 className="text-4xl font-black text-purple-600">
            ₹0
          </h2>

          <p className="mt-2">
            Revenue
          </p>

        </div>

      </div>

      <h2 className="text-3xl font-bold mb-6">
        Posted Jobs 📄
      </h2>

      <div className="grid gap-6 mb-14">

        {jobs.map((job: any) => (

          <div
            key={job.id}
            className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow"
          >

            <h3 className="text-2xl font-bold">
              {job.title}
            </h3>

            <p className="mt-3">
              {job.description}
            </p>

            <p className="mt-3">
              📍 {job.location}
            </p>

            <p className="mt-3 text-green-600 font-bold">
              ₹{job.salary}
            </p>

            <button
              onClick={() =>
                deleteJob(job.id)
              }
              className="mt-5 bg-red-600 text-white px-5 py-2 rounded-xl"
            >
              Delete Job
            </button>

          </div>

        ))}

      </div>

      <h2 className="text-3xl font-bold mb-6">
        Applications 👨‍💻
      </h2>

      <div className="grid gap-6">

        {applications.map(
          (item: any) => (

            <div
              key={item.id}
              className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow"
            >

              <h3 className="text-2xl font-bold">
                {item.jobs?.title}
              </h3>

              <p className="mt-3">
                Candidate:
                {" "}
                {item.users?.email}
              </p>

              <p className="mt-3">
                Status:
                {" "}
                <span className="font-bold text-green-600">
                  {item.status}
                </span>
              </p>

              {item.users?.resume && (

                <a
                  href={`${API}/uploads/${item.users.resume}`}
                  target="_blank"
                  className="inline-block mt-4 bg-blue-600 text-white px-5 py-2 rounded-xl"
                >
                  View Resume
                </a>

              )}

              <div className="flex gap-4 mt-6 flex-wrap">

                <button
                  onClick={() =>
                    updateStatus(
                      item.id,
                      "Accepted"
                    )
                  }
                  className="bg-green-600 text-white px-5 py-2 rounded-xl"
                >
                  Accept
                </button>

                <button
                  onClick={() =>
                    updateStatus(
                      item.id,
                      "Rejected"
                    )
                  }
                  className="bg-red-600 text-white px-5 py-2 rounded-xl"
                >
                  Reject
                </button>

              </div>

            </div>

          )
        )}

      </div>

    </main>

  );

}