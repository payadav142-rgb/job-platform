"use client";

import {
  useEffect,
  useState
} from "react";

import { useRouter }
from "next/navigation";

import toast
from "react-hot-toast";

export default function RecruiterDashboard() {

  const router =
    useRouter();

  const API =
    process.env.NEXT_PUBLIC_API_URL;

  const [jobs, setJobs] =
    useState<any[]>([]);

  const [applications, setApplications] =
    useState<any[]>([]);

  const [stats, setStats] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [filterStatus, setFilterStatus] =
    useState("All");

  const getStatusColor = (
    status: string
  ) => {

    switch (status) {

      case "Applied":
        return "text-gray-500";

      case "Reviewing":
        return "text-yellow-500";

      case "Shortlisted":
        return "text-blue-600";

      case "Selected":
        return "text-green-600";

      case "Rejected":
        return "text-red-600";

      case "Hired":
        return "text-purple-600";

      default:
        return "text-black";

    }

  };

  useEffect(() => {

    const token =
      localStorage.getItem(
        "token"
      );

    const storedUser =
      localStorage.getItem(
        "user"
      );

    if (
      !token ||
      !storedUser
    ) {

      router.push(
        "/login"
      );

      return;

    }

    const user =
      JSON.parse(
        storedUser
      );

    if (
      user.role !==
      "recruiter"
    ) {

      router.push("/");

      return;

    }

    fetchJobs(user.id);

    fetchApplications();

    fetchStats();

  }, []);

  const fetchStats =
    async () => {

      const user =
        JSON.parse(
          localStorage.getItem("user") || "{}"
        );

      try {

        const response =
          await fetch(
            `${API}/recruiter-stats/${user.id}`,
            {

              headers: {

                Authorization:
                  `Bearer ${localStorage.getItem("token")}`

              }

            }
          );

        const data =
          await response.json();

        if (data.success) {

          setStats(data);

        }

      } catch (error) {

        console.log(error);

      }

    };

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

        if (
          Array.isArray(data)
        ) {

          setJobs(data);

        }

      } catch {

        toast.error(
          "Failed To Load Jobs"
        );

      }

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

        if (
          Array.isArray(data)
        ) {

          setApplications(
            data
          );

        }

      } catch {

        toast.error(
          "Failed To Load Applications"
        );

      }

      setLoading(false);

    };

  const editJob =
    async (job: any) => {

      const title =
        prompt(
          "Edit Title",
          job.title
        );

      const description =
        prompt(
          "Edit Description",
          job.description
        );

      const location =
        prompt(
          "Edit Location",
          job.location
        );

      const salary =
        prompt(
          "Edit Salary",
          job.salary
        );

      if (
        !title ||
        !description ||
        !location ||
        !salary
      ) {

        return;

      }

      try {

        const response =
          await fetch(
            `${API}/jobs/${job.id}`,
            {

              method: "PUT",

              headers: {

                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${localStorage.getItem("token")}`

              },

              body: JSON.stringify({

                title,
                description,
                location,
                salary

              })

            }
          );

        const data =
          await response.json();

        if (data.success) {

          toast.success(
            "Job Updated 🚀"
          );

          const user =
            JSON.parse(
              localStorage.getItem("user") || "{}"
            );

          fetchJobs(user.id);

        }

      } catch {

        toast.error(
          "Update Failed"
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

        if (
          data.success
        ) {

          toast.success(
            "Job Deleted 🚀"
          );

          setJobs(
            jobs.filter(
              (job) =>
                job.id !== id
            )
          );

          fetchStats();

        }

      } catch {

        toast.error(
          "Delete Failed"
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

              body:
                JSON.stringify({
                  status
                })

            }
          );

        const data =
          await response.json();

        if (
          data.success
        ) {

          toast.success(
            "Status Updated 🚀"
          );

          fetchApplications();

          fetchStats();

        }

      } catch {

        toast.error(
          "Update Failed"
        );

      }

    };

  return (

    <main className="min-h-screen bg-gray-100 dark:bg-black dark:text-white p-4 md:p-10">

      <h1 className="text-4xl md:text-6xl font-black mb-10">
        Recruiter Dashboard 🚀
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">

        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-xl">

          <h2 className="text-lg font-semibold">
            Total Jobs
          </h2>

          <p className="text-4xl font-black mt-3 text-blue-600">
            {jobs.length}
          </p>

        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-xl">

          <h2 className="text-lg font-semibold">
            Total Applications
          </h2>

          <p className="text-4xl font-black mt-3 text-green-600">
            {applications.length}
          </p>

        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-xl">

          <h2 className="text-lg font-semibold">
            Shortlisted
          </h2>

          <p className="text-4xl font-black mt-3 text-yellow-500">
            {
              applications.filter(
                (app: any) =>
                  app.status ===
                  "Shortlisted"
              ).length
            }
          </p>

        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-xl">

          <h2 className="text-lg font-semibold">
            Hired
          </h2>

          <p className="text-4xl font-black mt-3 text-purple-600">
            {
              applications.filter(
                (app: any) =>
                  app.status ===
                  "Hired"
              ).length
            }
          </p>

        </div>

      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">

        <input
          type="text"
          placeholder="Search Applicant Email..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="flex-1 p-4 rounded-2xl bg-white dark:bg-gray-900 border outline-none"
        />

        <select
          value={filterStatus}
          onChange={(e) =>
            setFilterStatus(e.target.value)
          }
          className="p-4 rounded-2xl bg-white dark:bg-gray-900 border outline-none"
        >

          <option value="All">
            All
          </option>

          <option value="Applied">
            Applied
          </option>

          <option value="Reviewing">
            Reviewing
          </option>

          <option value="Shortlisted">
            Shortlisted
          </option>

          <option value="Rejected">
            Rejected
          </option>

          <option value="Hired">
            Hired
          </option>

        </select>

      </div>

      {loading && (
        <p>
          Loading...
        </p>
      )}

      <div className="grid gap-8">

        {jobs.map(
          (job: any) => (

            <div
              key={job.id}
              className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl"
            >

              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-5">

                <div>

                  <h2 className="text-3xl font-black">
                    {job.title}
                  </h2>

                  <p className="mt-3 text-gray-600 dark:text-gray-300">
                    {job.description}
                  </p>

                  <p className="mt-3">
                    📍 {job.location}
                  </p>

                  <p className="mt-2 text-green-500 text-2xl font-bold">
                    ₹{job.salary}
                  </p>

                </div>

                <div className="flex gap-4">

                  <button
                    onClick={() =>
                      editJob(job)
                    }
                    className="bg-yellow-500 text-white px-6 py-3 rounded-2xl font-bold"
                  >
                    Edit Job
                  </button>

                  <button
                    onClick={() =>
                      deleteJob(
                        job.id
                      )
                    }
                    className="bg-red-600 text-white px-6 py-3 rounded-2xl font-bold"
                  >
                    Delete Job
                  </button>

                </div>

              </div>

              <div className="mt-10">

                <h3 className="text-2xl font-bold mb-6">
                  Applicants
                </h3>

                <div className="grid gap-5">

                  {applications
                    .filter(
                      (app: any) =>
                        app.job_id ===
                        job.id
                    )
                    .filter(
                      (app: any) =>
                        app.users?.email
                          ?.toLowerCase()
                          .includes(
                            search.toLowerCase()
                          )
                    )
                    .filter(
                      (app: any) =>
                        filterStatus ===
                        "All"
                          ? true
                          : app.status ===
                            filterStatus
                    )
                    .map(
                      (
                        app: any
                      ) => (

                        <div
                          key={app.id}
                          className="bg-gray-100 dark:bg-gray-800 p-5 rounded-2xl"
                        >

                          <h4 className="text-xl font-bold">
                            {
                              app.users
                                ?.email
                            }
                          </h4>

                          {app.users?.resume && (

                            <a
                              href={`${API}/uploads/${app.users.resume}`}
                              target="_blank"
                              className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-xl"
                            >
                              View Resume
                            </a>

                          )}

                          <p className="mt-2">
                            Status:
                            <span
                              className={`ml-2 font-bold ${getStatusColor(
                                app.status
                              )}`}
                            >
                              {app.status}
                            </span>
                          </p>

                          <div className="flex flex-wrap gap-3 mt-5">

                            <button
                              onClick={() =>
                                updateStatus(
                                  app.id,
                                  "Reviewing"
                                )
                              }
                              className="bg-yellow-500 text-white px-4 py-2 rounded-xl"
                            >
                              Reviewing
                            </button>

                            <button
                              onClick={() =>
                                updateStatus(
                                  app.id,
                                  "Shortlisted"
                                )
                              }
                              className="bg-blue-600 text-white px-4 py-2 rounded-xl"
                            >
                              Shortlist
                            </button>

                            <button
                              onClick={() =>
                                updateStatus(
                                  app.id,
                                  "Hired"
                                )
                              }
                              className="bg-purple-600 text-white px-4 py-2 rounded-xl"
                            >
                              Hire
                            </button>

                            <button
                              onClick={() =>
                                updateStatus(
                                  app.id,
                                  "Rejected"
                                )
                              }
                              className="bg-red-600 text-white px-4 py-2 rounded-xl"
                            >
                              Reject
                            </button>

                          </div>

                        </div>

                      )
                    )}

                </div>

              </div>

            </div>

          )
        )}

      </div>

    </main>

  );

}