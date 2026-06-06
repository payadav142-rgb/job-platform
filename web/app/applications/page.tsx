"use client";

import {
  useEffect,
  useState
} from "react";

import toast from "react-hot-toast";

export default function Applications() {

  const [
    applications,
    setApplications
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
    filter,
    setFilter
  ] = useState("All");

  const getStatusColor =
    (status: string) => {

      switch (status) {

        case "Applied":
          return "bg-blue-100 text-blue-700";

        case "Reviewing":
          return "bg-yellow-100 text-yellow-700";

        case "Shortlisted":
          return "bg-purple-100 text-purple-700";

        case "Hired":
          return "bg-green-100 text-green-700";

        case "Rejected":
          return "bg-red-100 text-red-700";

        default:
          return "bg-gray-100 text-gray-700";

      }

    };

  const fetchApplications =
    async () => {

      try {

        const response =
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/applications`
          );

        const data =
          await response.json();

        if (
          Array.isArray(data)
        ) {

          setApplications(data);

        }

      } catch {

        toast.error(
          "Failed To Load Applications"
        );

      }

      setLoading(false);

    };

  useEffect(() => {

    fetchApplications();

  }, []);

  const updateStatus =
    async (
      applicationId: string,
      status: string
    ) => {

      try {

        const response =
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/applications/${applicationId}`,
            {

              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json"
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
            `Candidate ${status}`
          );

          fetchApplications();

        } else {

          toast.error(
            "Failed"
          );

        }

      } catch {

        toast.error(
          "Server Error"
        );

      }

    };

  const filteredApplications =
    applications
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
          filter === "All"
            ? true
            : app.status === filter
      );

  return (

    <main className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-black dark:via-gray-950 dark:to-black p-4 md:p-10">

      <h1 className="text-4xl md:text-5xl font-black mb-10">
        Applications 🚀
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-xl">
          <h2 className="text-lg font-semibold">
            Total
          </h2>

          <p className="text-4xl font-black text-blue-600 mt-3">
            {applications.length}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-xl">
          <h2 className="text-lg font-semibold">
            Shortlisted
          </h2>

          <p className="text-4xl font-black text-purple-600 mt-3">
            {
              applications.filter(
                (a: any) =>
                  a.status ===
                  "Shortlisted"
              ).length
            }
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-xl">
          <h2 className="text-lg font-semibold">
            Hired
          </h2>

          <p className="text-4xl font-black text-green-600 mt-3">
            {
              applications.filter(
                (a: any) =>
                  a.status ===
                  "Hired"
              ).length
            }
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-xl">
          <h2 className="text-lg font-semibold">
            Rejected
          </h2>

          <p className="text-4xl font-black text-red-600 mt-3">
            {
              applications.filter(
                (a: any) =>
                  a.status ===
                  "Rejected"
              ).length
            }
          </p>
        </div>

      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-10">

        <input
          type="text"
          placeholder="Search Candidate..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="flex-1 p-4 rounded-2xl border bg-white dark:bg-gray-900 outline-none"
        />

        <select
          value={filter}
          onChange={(e) =>
            setFilter(
              e.target.value
            )
          }
          className="p-4 rounded-2xl border bg-white dark:bg-gray-900 outline-none"
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

          <option value="Hired">
            Hired
          </option>

          <option value="Rejected">
            Rejected
          </option>

        </select>

      </div>

      {loading && (

        <p>
          Loading...
        </p>

      )}

      <div className="grid gap-6">

        {filteredApplications.map(
          (app: any) => (

            <div
              key={app.id}
              className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl"
            >

              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-5">

                <div>

                  <h2 className="text-2xl font-black">
                    👤 {app.users?.email}
                  </h2>

                  <p className="mt-3 text-lg">
                    Applied For:
                    {" "}
                    <span className="font-bold">
                      {app.jobs?.title}
                    </span>
                  </p>

                  <div className="mt-4">

                    <span
                      className={`px-4 py-2 rounded-full font-bold ${getStatusColor(
                        app.status
                      )}`}
                    >
                      {app.status || "Applied"}
                    </span>

                  </div>

                  {app.users?.resume && (

                    <a
                      href={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${app.users.resume}`}
                      target="_blank"
                      className="inline-block mt-5 bg-blue-600 text-white px-5 py-2 rounded-xl"
                    >
                      View Resume
                    </a>

                  )}

                </div>

              </div>

              <div className="flex flex-wrap gap-4 mt-8">

                <button
                  onClick={() =>
                    updateStatus(
                      app.id,
                      "Reviewing"
                    )
                  }
                  className="bg-yellow-500 text-white px-5 py-2 rounded-xl font-bold"
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
                  className="bg-purple-600 text-white px-5 py-2 rounded-xl font-bold"
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
                  className="bg-green-600 text-white px-5 py-2 rounded-xl font-bold"
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
                  className="bg-red-600 text-white px-5 py-2 rounded-xl font-bold"
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