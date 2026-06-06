"use client";

import {
  useEffect,
  useState
} from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function MyApplications() {
  const router = useRouter();
  const [applications, setApplications] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const authToken =
  localStorage.getItem("token");

if (!authToken) {

  router.push("/login");

  return;

}
    fetchApplications();

  }, []);

  const fetchApplications =
    async () => {

      const storedUser =
        localStorage.getItem("user");

      if (!storedUser) {

        setLoading(false);

        return;

      }

      const user =
        JSON.parse(storedUser);

      try {

        const response =
  await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/my-applications/${user.id}`,
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
          "Failed To Load"
        );

      }

      setLoading(false);

    };

  return (

    <main className="min-h-screen bg-gray-100 dark:bg-black dark:text-white p-4 md:p-10">

      <h1 className="text-3xl md:text-5xl font-bold mb-10">
        My Applications 📄
      </h1>

      {loading && (

        <p>
          Loading...
        </p>

      )}

      {!loading &&
        applications.length === 0 && (

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">

          <p className="text-lg">
            No Applications Found
          </p>

        </div>

      )}

      <div className="grid gap-6">

        {applications.map((item: any) => (

          <div
            key={item.id}
            className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow"
          >

            <h2 className="text-2xl font-bold">
              {item.jobs?.title}
            </h2>

            <p className="mt-3">
              {item.jobs?.description}
            </p>

            <p className="mt-2">
              📍 {item.jobs?.location}
            </p>

            <p className="mt-2">
              💰 ₹{item.jobs?.salary}
            </p>

            <div className="mt-5">

              <span className="bg-green-600 text-white px-4 py-2 rounded-xl">
                {item.status}
              </span>

            </div>

          </div>

        ))}

      </div>

    </main>

  );

}