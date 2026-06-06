"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function RecruiterApplications() {
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL;

  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API}/applications`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      const data = await response.json();

      if (Array.isArray(data)) {
        setApplications(data);
      } else {
        setApplications([]);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed To Load Applications");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      console.log("Updating:", id, status);

      const response = await fetch(`${API}/applications/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      console.log("SERVER RESPONSE:", data);

      if (data.success) {
        toast.success(`Application marked as ${status}`);
        fetchApplications(); // Update hone ke baad list refresh karne ke liye
      } else {
        toast.error(data.message || "Update Failed");
      }
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("Server Error");
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-black dark:text-white p-4 md:p-10">
      <h1 className="text-4xl font-bold mb-10">Applicants 📄</h1>

      {loading ? (
        <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
          Loading...
        </p>
      ) : applications.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
          <p className="text-gray-500 dark:text-gray-400">No Applications Found</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {applications.map((item: any) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow"
            >
              <h2 className="text-2xl font-bold">{item.users?.email}</h2>

              <p className="mt-3">
                Applied For: <b>{item.jobs?.title}</b>
              </p>

              <p className="mt-2">
                Status:{" "}
                <span className="text-green-500 font-bold">{item.status}</span>
              </p>

              {item.users?.resume && (
                <a
                  href={`${API}/uploads/${item.users.resume}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-xl"
                >
                  View Resume
                </a>
              )}

              <div className="flex gap-4 mt-6 flex-wrap">
                <button
                  onClick={() => updateStatus(item.id, "Shortlisted")}
                  className="bg-green-600 hover:bg-green-700 transition text-white px-5 py-2 rounded-xl"
                >
                  Shortlist
                </button>

                <button
                  onClick={() => updateStatus(item.id, "Rejected")}
                  className="bg-red-600 hover:bg-red-700 transition text-white px-5 py-2 rounded-xl"
                >
                  Reject
                </button>

                <button
                  onClick={() => updateStatus(item.id, "Hired")}
                  className="bg-purple-600 hover:bg-purple-700 transition text-white px-5 py-2 rounded-xl"
                >
                  Hire
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}