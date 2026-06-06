"use client";

import {
  useEffect,
  useState
} from "react";

import {
  useRouter
} from "next/navigation";

import toast from "react-hot-toast";

export default function CandidateDashboard() {

  const router =
    useRouter();

  const [
    applications,
    setApplications
  ] = useState<any[]>([]);

  const [
    savedJobs,
    setSavedJobs
  ] = useState<any[]>([]);

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    search,
    setSearch
  ] = useState("");

  const [
    filterStatus,
    setFilterStatus
  ] = useState("All");

  const [
    user,
    setUser
  ] = useState<any>(null);

  const [
    resumeScore,
    setResumeScore
  ] = useState<number | null>(null);

  useEffect(() => {

    const authToken =
      localStorage.getItem(
        "token"
      );

    if (!authToken) {

      router.push("/login");

      return;

    }

    const storedUser =
      localStorage.getItem(
        "user"
      );

    if (!storedUser) {

      router.push("/login");

      return;

    }

    const parsedUser =
      JSON.parse(
        storedUser
      );

    setUser(parsedUser);

    fetchApplications(
      parsedUser.id,
      authToken
    );

    fetchSavedJobs(
      parsedUser.id,
      authToken
    );

  }, []);

  const fetchApplications =
    async (
      userId: string,
      token: string
    ) => {

      try {

        const response =
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/my-applications/${userId}`,
            {

              headers: {

                Authorization:
                  `Bearer ${token}`

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

  const fetchSavedJobs =
    async (
      userId: string,
      token: string
    ) => {

      try {

        const response =
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/saved-jobs/${userId}`,
            {

              headers: {

                Authorization:
                  `Bearer ${token}`

              }

            }
          );

        const data =
          await response.json();

        if (
          Array.isArray(data)
        ) {

          setSavedJobs(
            data
          );

        }

      } catch {

        toast.error(
          "Failed To Load Saved Jobs"
        );

      }

    };

  const removeSavedJob =
    async (
      id: string
    ) => {

      try {

        const response =
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/saved-jobs/${id}`,
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
            "Removed Successfully"
          );

          setSavedJobs(
            savedJobs.filter(
              (job) =>
                job.id !== id
            )
          );

        }

      } catch {

        toast.error(
          "Remove Failed"
        );

      }

    };

  const getStatusColor =
    (status: string) => {

      switch (status) {

        case "Applied":
          return "bg-blue-100 text-blue-700";

        case "Reviewing":
          return "bg-yellow-100 text-yellow-700";

        case "Shortlisted":
          return "bg-purple-100 text-purple-700";

        case "Accepted":
          return "bg-green-100 text-green-700";

        case "Rejected":
          return "bg-red-100 text-red-700";

        case "Hired":
          return "bg-pink-100 text-pink-700";

        default:
          return "bg-gray-100 text-gray-700";

      }

    };

  const totalApplications =
    applications.length;

  const acceptedApplications =
    applications.filter(
      (app) =>
        app.status ===
        "Accepted"
    ).length;

  const rejectedApplications =
    applications.filter(
      (app) =>
        app.status ===
        "Rejected"
    ).length;

  const shortlistedApplications =
    applications.filter(
      (app) =>
        app.status ===
        "Shortlisted"
    ).length;

  return (

    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-purple-100 dark:from-black dark:via-gray-950 dark:to-black dark:text-white p-4 md:p-10">

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-10">

        <div>

          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Candidate Dashboard 🚀
          </h1>

          <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg">
            Welcome back,
            {" "}
            {user?.email}
          </p>

        </div>

        <button
          onClick={() => {

            localStorage.clear();

            document.cookie =
              "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

            router.push("/login");

          }}
          className="bg-red-600 text-white px-6 py-3 rounded-2xl font-bold"
        >
          Logout
        </button>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">

        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl">

          <h2 className="text-4xl font-black text-blue-600">
            {totalApplications}
          </h2>

          <p className="mt-2">
            Total Applications
          </p>

        </div>

        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl">

          <h2 className="text-4xl font-black text-green-600">
            {acceptedApplications}
          </h2>

          <p className="mt-2">
            Accepted
          </p>

        </div>

        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl">

          <h2 className="text-4xl font-black text-red-600">
            {rejectedApplications}
          </h2>

          <p className="mt-2">
            Rejected
          </p>

        </div>

        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl">

          <h2 className="text-4xl font-black text-purple-600">
            {shortlistedApplications}
          </h2>

          <p className="mt-2">
            Shortlisted
          </p>

        </div>

      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-10">

        <input
          type="text"
          placeholder="Search Jobs..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="flex-1 p-5 rounded-2xl border bg-white dark:bg-gray-900 outline-none"
        />

        <select
          value={filterStatus}
          onChange={(e) =>
            setFilterStatus(
              e.target.value
            )
          }
          className="p-5 rounded-2xl border bg-white dark:bg-gray-900 outline-none"
        >

          <option value="All">
            All Status
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

          <option value="Accepted">
            Accepted
          </option>

          <option value="Rejected">
            Rejected
          </option>

          <option value="Hired">
            Hired
          </option>

        </select>

      </div>

      <div className="mb-16">

        <h2 className="text-3xl font-black mb-6">
          Saved Jobs ❤️
        </h2>

        <div className="grid gap-6">

          {savedJobs.length === 0 && (

            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-xl">

              <p>
                No Saved Jobs
              </p>

            </div>

          )}

          {savedJobs.map(
            (job: any) => (

              <div
                key={job.id}
                className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl"
              >

                <h2 className="text-2xl font-bold">
                  {job.jobs?.title}
                </h2>

                <p className="mt-4 text-gray-600 dark:text-gray-300">
                  {job.jobs?.description}
                </p>

                <p className="mt-4">
                  📍 {job.jobs?.location}
                </p>

                <p className="mt-3 text-2xl font-bold text-green-600">
                  ₹{job.jobs?.salary}
                </p>

                <button
                  onClick={() =>
                    removeSavedJob(
                      job.id
                    )
                  }
                  className="mt-5 bg-red-600 text-white px-5 py-2 rounded-2xl"
                >
                  Remove
                </button>

              </div>

            )
          )}

        </div>

      </div>

      <div>

        <h2 className="text-3xl font-black mb-6">
          Applied Jobs 📄
        </h2>

        <div className="grid gap-6">

          {applications
            .filter(
              (app: any) =>
                app.jobs?.title
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
            .map((app: any) => (

              <div
                key={app.id}
                className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl"
              >

                <h2 className="text-3xl font-black">
                  {app.jobs?.title}
                </h2>

                <p className="mt-4 text-gray-600 dark:text-gray-300">
                  {app.jobs?.description}
                </p>

                <p className="mt-4">
                  📍 {app.jobs?.location}
                </p>

                <p className="mt-3 text-3xl font-black text-green-600">
                  ₹{app.jobs?.salary}
                </p>

                <div className="mt-6">

                  <span
                    className={`px-5 py-2 rounded-full font-bold ${getStatusColor(
                      app.status
                    )}`}
                  >
                    {app.status}
                  </span>

                </div>

              </div>

            ))}

        </div>

      </div>

    </main>

  );

}