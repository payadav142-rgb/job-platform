"use client";

import {
  useEffect,
  useState
} from "react";

import {
  useRouter
} from "next/navigation";

import toast from "react-hot-toast";

export default function SavedJobs() {

  const router =
    useRouter();

  const [
    jobs,
    setJobs
  ] = useState<any[]>([]);

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    search,
    setSearch
  ] = useState("");

  useEffect(() => {

    const authToken =
      localStorage.getItem(
        "token"
      );

    if (!authToken) {

      router.push("/login");

      return;

    }

    fetchSavedJobs();

  }, []);

  const fetchSavedJobs =
    async () => {

      const storedUser =
        localStorage.getItem(
          "user"
        );

      if (!storedUser) {

        setLoading(false);

        return;

      }

      const user =
        JSON.parse(
          storedUser
        );

      try {

        const response =
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/saved-jobs/${user.id}`,
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

        } else {

          setJobs([]);

        }

      } catch {

        toast.error(
          "Failed To Load"
        );

      }

      setLoading(false);

    };

  const removeJob =
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
            "Removed Successfully ❌"
          );

          setJobs(
            (prevJobs) =>
              prevJobs.filter(
                (job) =>
                  String(job.id) !==
                  String(id)
              )
          );

        } else {

          toast.error(
            "Failed To Remove"
          );

        }

      } catch {

        toast.error(
          "Server Error"
        );

      }

    };

  return (

    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-purple-100 dark:from-black dark:via-gray-950 dark:to-black dark:text-white p-4 md:p-10">

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-5 mb-10">

        <div>

          <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
            Saved Jobs ❤️
          </h1>

          <p className="mt-3 text-gray-600 dark:text-gray-300 text-lg">
            Manage your saved opportunities
          </p>

        </div>

        <button
          onClick={() =>
            router.push("/candidate")
          }
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold"
        >
          Dashboard
        </button>

      </div>

      <div className="mb-10">

        <input
          type="text"
          placeholder="Search Saved Jobs..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="w-full p-5 rounded-2xl border bg-white dark:bg-gray-900 outline-none"
        />

      </div>

      {loading && (

        <p className="text-lg">
          Loading...
        </p>

      )}

      {!loading &&
        jobs.length === 0 && (

        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl">

          <p className="text-lg">
            No Saved Jobs Found
          </p>

        </div>

      )}

      <div className="grid gap-6">

        {jobs
          .filter(
            (item: any) =>
              item.jobs?.title
                ?.toLowerCase()
                .includes(
                  search.toLowerCase()
                )
          )
          .map((item: any) => (

            <div
              key={item.id}
              className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl hover:-translate-y-2 transition-all duration-300"
            >

              <h2 className="text-3xl font-black">
                {item.jobs?.title}
              </h2>

              <p className="mt-4 text-gray-600 dark:text-gray-300 leading-8">
                {item.jobs?.description}
              </p>

              <p className="mt-4 text-lg">
                📍 {item.jobs?.location}
              </p>

              <p className="mt-3 text-3xl font-black text-green-600">
                ₹{item.jobs?.salary}
              </p>

              <div className="flex gap-4 flex-wrap mt-6">

                <button
                  onClick={() =>
                    router.push("/")
                  }
                  className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold"
                >
                  Apply Now
                </button>

                <button
                  onClick={() =>
                    removeJob(
                      String(item.id)
                    )
                  }
                  className="bg-red-600 text-white px-6 py-3 rounded-2xl font-bold"
                >
                  Remove
                </button>

              </div>

            </div>

          ))}

      </div>

    </main>

  );

}