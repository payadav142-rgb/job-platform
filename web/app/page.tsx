"use client";

import toast from "react-hot-toast";
import Navbar from "./components/Navbar";

import {
  useEffect,
  useState
} from "react";

export default function Home() {

  const [jobs, setJobs] =
    useState<any[]>([]);

  const [resumeText, setResumeText] =
    useState("");

  const [matchData, setMatchData] =
    useState<any>(null);

  const [search, setSearch] =
    useState("");

  const [user, setUser] =
    useState<any>(null);

  const [loadingJobId, setLoadingJobId] =
    useState<number | null>(null);

  const [savingJobId, setSavingJobId] =
    useState<number | null>(null);

  const [resumeScore, setResumeScore] =
    useState<number | null>(null);

  const [resumeSkills, setResumeSkills] =
    useState<string[]>([]);

  const [resumeSuggestions, setResumeSuggestions] =
    useState<string[]>([]);

  const API =
    process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {

    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {

      try {

        setUser(
          JSON.parse(storedUser)
        );

      } catch {

        localStorage.removeItem(
          "user"
        );

      }

    }

    fetch(`${API}/jobs`)
      .then((res) => res.json())
      .then((data) => {

        if (Array.isArray(data)) {

          setJobs(data);

        } else {

          setJobs([]);

        }

      })
      .catch(() => {

        toast.error(
          "Failed to load jobs"
        );

      });

  }, []);

  const analyzeResume = async (
    file: File
  ) => {

    const formData =
      new FormData();

    formData.append(
      "resume",
      file
    );

    try {

      const response =
        await fetch(
          `${API}/analyze-resume`,
          {
            method: "POST",
            body: formData
          }
        );

      const data =
        await response.json();

      if (data.success) {

        setResumeScore(
          data.score
        );

        setResumeSkills(
          data.skills
        );

        setResumeSuggestions(
          data.suggestions
        );

        toast.success(
          "Resume Analyzed 🚀"
        );

      } else {

        toast.error(
          "Analysis Failed"
        );

      }

    } catch {

      toast.error(
        "Analysis Failed"
      );

    }

  };

  const uploadResume = async (
    e: any
  ) => {

    const file =
      e.target.files[0];

    if (!file) {

      return;

    }

    if (!user) {

      toast.error(
        "Please Login First"
      );

      return;

    }

    analyzeResume(file);

    const formData =
      new FormData();

    formData.append(
      "resume",
      file
    );

    formData.append(
      "user_id",
      String(user.id)
    );

    try {

      const token =
        localStorage.getItem(
          "token"
        );

      if (!token) {

        toast.error(
          "Login Again"
        );

        return;

      }

      const response =
        await fetch(
          `${API}/upload-resume`,
          {
            method: "POST",

            headers: {
              Authorization:
                `Bearer ${token}`
            },

            body: formData
          }
        );

      const data =
        await response.json();

      console.log(data);

      if (data.success) {

        setResumeText(
          data.text || ""
        );

        const updatedUser = {
          ...user,
          resume: data.file
        };

        localStorage.setItem(
          "user",
          JSON.stringify(updatedUser)
        );

        setUser(updatedUser);

        toast.success(
          "Resume Uploaded 🚀"
        );

      } else {

        toast.error(
          data.message ||
          "Upload Failed"
        );

      }

    } catch (error) {

      console.log(error);

      toast.error(
        "Server Error"
      );

    }

  };

  const applyJob = async (
    jobId: number
  ) => {

    if (!user) {

      toast.error(
        "Login First"
      );

      return;

    }

    try {

      setLoadingJobId(jobId);

      const token =
        localStorage.getItem(
          "token"
        );

      if (!token) {

        toast.error(
          "Please Login Again"
        );

        return;

      }

      console.log(
        "TOKEN:",
        token
      );

      const response =
        await fetch(
          `${API}/apply`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`
            },

            body: JSON.stringify({
              user_id:
                user.id,
              job_id:
                jobId
            })
          }
        );

      const data =
        await response.json();

      console.log(data);

      if (data.success) {

        toast.success(
          "Applied Successfully 🚀"
        );

      } else {

        toast.error(
          data.message ||
          "Apply Failed"
        );

      }

    } catch (error) {

      console.log(error);

      toast.error(
        "Server Error"
      );

    }

    setLoadingJobId(null);

  };

  const saveJob = async (
    jobId: number
  ) => {

    if (!user) {

      toast.error(
        "Login First"
      );

      return;

    }

    try {

      setSavingJobId(jobId);

      const token =
        localStorage.getItem(
          "token"
        );

      if (!token) {

        toast.error(
          "Please Login Again"
        );

        return;

      }

      const response =
        await fetch(
          `${API}/save-job`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`
            },

            body: JSON.stringify({
              user_id:
                user.id,
              job_id:
                jobId
            })
          }
        );

      const data =
        await response.json();

      console.log(data);

      if (data.success) {

        toast.success(
          "Job Saved ❤️"
        );

      } else {

        toast.error(
          data.message ||
          "Save Failed"
        );

      }

    } catch (error) {

      console.log(error);

      toast.error(
        "Server Error"
      );

    }

    setSavingJobId(null);

  };

  const getMatchScore =
    async (job: any) => {

      if (!resumeText) {

        toast.error(
          "Upload Resume First"
        );

        return;

      }

      try {

        const response =
          await fetch(
            `${API}/match-score`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body: JSON.stringify({
                resumeText,
                jobDescription:
                  job.description
              })
            }
          );

        const data =
          await response.json();

        console.log(data);

        if (data.success) {

          setMatchData({
            ...data,
            jobId: job.id
          });

          toast.success(
            "Match Score Ready 🚀"
          );

        } else {

          toast.error(
            "Match Failed"
          );

        }

      } catch (error) {

        console.log(error);

        toast.error(
          "Server Error"
        );

      }

    };

  return (

    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-purple-100 dark:from-black dark:via-gray-950 dark:to-black dark:text-white p-4 md:p-10 transition-all duration-500">

      <Navbar />

      <div className="mt-8">

        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-10 mb-16">

          <div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              Find Your
              <br />
              Dream Job 🚀
            </h1>

            <p className="text-gray-600 dark:text-gray-400 mt-6 text-lg md:text-2xl max-w-2xl leading-9">
              Explore premium opportunities from top companies worldwide.
            </p>

          </div>

        </div>

        <div className="mb-10">

          <label className="block mb-4 text-xl font-bold">
            Upload Resume 📄
          </label>

          <input
            type="file"
            onChange={uploadResume}
            className="w-full bg-white/80 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700 p-5 rounded-[28px] shadow-xl"
          />

        </div>

        {resumeScore !== null && (

          <div className="mb-10 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl">

            <h2 className="text-3xl font-bold mb-5">
              AI Resume Analysis 🚀
            </h2>

            <p className="text-2xl font-bold text-green-600">
              Score: {resumeScore}/100
            </p>

            <div className="mt-5">

              <h3 className="text-xl font-bold mb-3">
                Skills Detected:
              </h3>

              <div className="flex gap-3 flex-wrap">

                {resumeSkills.map(
                  (skill, index) => (

                    <span
                      key={index}
                      className="bg-blue-600 text-white px-4 py-2 rounded-xl"
                    >
                      {skill}
                    </span>

                  )
                )}

              </div>

            </div>

            <div className="mt-6">

              <h3 className="text-xl font-bold mb-3">
                Suggestions:
              </h3>

              <div className="flex flex-col gap-2">

                {resumeSuggestions.map(
                  (
                    suggestion,
                    index
                  ) => (

                    <p
                      key={index}
                      className="text-red-500"
                    >
                      • {suggestion}
                    </p>

                  )
                )}

              </div>

            </div>

          </div>

        )}

        <div className="relative mb-14">

          <input
            type="text"
            placeholder="🔍 Search Jobs..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="w-full p-6 pl-8 rounded-[32px] text-lg text-black dark:text-white border border-gray-200 bg-white/90 dark:bg-gray-900"
          />

        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">

          {jobs
            .filter((job: any) =>
              job.title
                ?.toLowerCase()
                .includes(
                  search.toLowerCase()
                )
            )
            .map((job: any) => (

              <div
                key={job.id}
                className="bg-white/80 dark:bg-gray-900/90 p-10 rounded-[36px] shadow-xl"
              >

                <h2 className="text-3xl md:text-4xl font-black dark:text-white">
                  {job.title}
                </h2>

                <p className="mt-8 text-gray-600 dark:text-white text-lg leading-9">
                  {job.description}
                </p>

                <p className="mt-8 text-xl font-semibold dark:text-gray-200">
                  📍 {job.location}
                </p>

                <p className="mt-5 text-4xl font-black text-green-500">
                  💰 ₹{job.salary}
                </p>

                {matchData?.jobId ===
                  job.id && (

                  <div className="mt-6 bg-black/10 dark:bg-white/10 p-5 rounded-2xl">

                    <h3 className="text-2xl font-bold mb-3">
                      Match Score 🚀
                    </h3>

                    <p className="text-green-500 text-3xl font-black">
                      {matchData.score}%
                    </p>

                    <div className="mt-4">

                      <p className="font-bold mb-2">
                        Matched Skills:
                      </p>

                      <div className="flex gap-2 flex-wrap">

                        {matchData.matched.map(
                          (
                            skill: string
                          ) => (

                            <span
                              key={skill}
                              className="bg-green-600 text-white px-3 py-1 rounded-xl"
                            >
                              {skill}
                            </span>

                          )
                        )}

                      </div>

                    </div>

                    <div className="mt-4">

                      <p className="font-bold mb-2">
                        Missing Skills:
                      </p>

                      <div className="flex gap-2 flex-wrap">

                        {matchData.missing.map(
                          (
                            skill: string
                          ) => (

                            <span
                              key={skill}
                              className="bg-red-600 text-white px-3 py-1 rounded-xl"
                            >
                              {skill}
                            </span>

                          )
                        )}

                      </div>

                    </div>

                  </div>

                )}

                <div className="flex gap-5 flex-wrap mt-10">

                  <button
                    onClick={() =>
                      applyJob(job.id)
                    }
                    className="bg-green-600 text-white px-8 py-4 rounded-2xl font-bold"
                  >
                    {loadingJobId ===
                    job.id
                      ? "Applying..."
                      : "Apply"}
                  </button>

                  <button
                    onClick={() =>
                      saveJob(job.id)
                    }
                    className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold"
                  >
                    {savingJobId ===
                    job.id
                      ? "Saving..."
                      : "Save"}
                  </button>

                  <button
                    onClick={() =>
                      getMatchScore(
                        job
                      )
                    }
                    className="bg-pink-600 text-white px-8 py-4 rounded-2xl font-bold"
                  >
                    AI Match Score 🤖
                  </button>

                </div>

              </div>

            ))}

        </div>

      </div>

    </main>

  );

}