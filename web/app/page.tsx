"use client";

import toast from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
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

        <section className="relative overflow-hidden mb-20">

  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-[40px]" />

  <div className="relative grid lg:grid-cols-2 gap-12 items-center bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/20 dark:border-gray-800 rounded-[40px] p-10 md:p-16 shadow-2xl">

    {/* LEFT SIDE */}
    <div>

      <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
        🚀 AI Powered Recruitment Platform
      </div>

      <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">

        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
          Find Your
        </span>

        <br />

        <span className="text-gray-900 dark:text-white">
          Dream Job
        </span>

      </h1>

      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-xl leading-8 mb-8">
        Discover premium jobs from top companies,
        upload your resume, get AI match scores
        and land your next opportunity faster.
      </p>

      <div className="flex flex-wrap gap-4 mb-10">

        <button
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold shadow-xl hover:scale-105 transition-all"
        >
          Find Jobs
        </button>

        <button
          className="px-8 py-4 rounded-2xl border-2 border-gray-300 dark:border-gray-700 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
        >
          Post Job
        </button>

      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg text-center">
          <h3 className="text-3xl font-black text-blue-600">
            5K+
          </h3>
          <p className="text-sm text-gray-500">
            Jobs
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg text-center">
          <h3 className="text-3xl font-black text-purple-600">
            1K+
          </h3>
          <p className="text-sm text-gray-500">
            Companies
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg text-center">
          <h3 className="text-3xl font-black text-pink-600">
            25K+
          </h3>
          <p className="text-sm text-gray-500">
            Candidates
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg text-center">
          <h3 className="text-3xl font-black text-green-600">
            98%
          </h3>
          <p className="text-sm text-gray-500">
            Success
          </p>
        </div>

      </div>

    </div>

    {/* RIGHT SIDE */}
    <div className="hidden lg:flex justify-center">

      <div className="w-full max-w-md bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-[40px] p-8 shadow-2xl">

        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8">

          <div className="text-center">

            <div className="text-7xl mb-4">
              💼
            </div>

            <h2 className="text-3xl font-black mb-4">
              AI Hiring
            </h2>

            <p className="text-gray-500 mb-6">
              Resume Analysis • Match Score • Smart Hiring
            </p>

            <div className="space-y-3">

              <div className="bg-green-100 text-green-700 rounded-xl p-3 font-semibold">
                ✓ Resume Uploaded
              </div>

              <div className="bg-blue-100 text-blue-700 rounded-xl p-3 font-semibold">
                ✓ AI Match Score
              </div>

              <div className="bg-purple-100 text-purple-700 rounded-xl p-3 font-semibold">
                ✓ Job Recommendations
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>

</section>

<section className="mb-20">

  <div className="text-center mb-10">

    <h2 className="text-4xl font-black mb-3">
      Trusted By Top Companies
    </h2>

    <p className="text-gray-500 text-lg">
      Thousands of companies hire through JobHub
    </p>

  </div>

  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-5">

    {[
      "Google",
      "Microsoft",
      "Amazon",
      "Infosys",
      "TCS",
      "Wipro",
      "Accenture",
      "IBM"
    ].map((company) => (

      <div
        key={company}
        className="
          bg-white dark:bg-gray-900
          border border-gray-200 dark:border-gray-800
          rounded-3xl
          p-5
          text-center
          font-bold
          shadow-md
          hover:shadow-xl
          hover:-translate-y-2
          transition-all duration-300
        "
      >
        {company}
      </div>

    ))}

  </div>

</section>

<section className="mb-20">

  <div className="text-center mb-12">

    <h2 className="text-4xl font-black mb-3">
      Why Choose JobHub?
    </h2>

    <p className="text-gray-500 text-lg">
      Everything you need to get hired faster
    </p>

  </div>

  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

    <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all">
      <div className="text-5xl mb-4">🤖</div>
      <h3 className="text-xl font-bold mb-3">
        AI Resume Analysis
      </h3>
      <p className="text-gray-500">
        Analyze resumes instantly and get improvement suggestions.
      </p>
    </div>

    <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all">
      <div className="text-5xl mb-4">🎯</div>
      <h3 className="text-xl font-bold mb-3">
        AI Match Score
      </h3>
      <p className="text-gray-500">
        Find jobs that perfectly match your skills.
      </p>
    </div>

    <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all">
      <div className="text-5xl mb-4">⚡</div>
      <h3 className="text-xl font-bold mb-3">
        One Click Apply
      </h3>
      <p className="text-gray-500">
        Apply to jobs quickly without lengthy forms.
      </p>
    </div>

    <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all">
      <div className="text-5xl mb-4">✅</div>
      <h3 className="text-xl font-bold mb-3">
        Verified Companies
      </h3>
      <p className="text-gray-500">
        Only trusted recruiters and verified companies.
      </p>
    </div>

  </div>

</section>

<section className="mb-20">

  <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-[40px] p-10 md:p-16 text-white">

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">

      <div>
        <h2 className="text-5xl font-black">
          5000+
        </h2>
        <p className="mt-2 text-lg opacity-90">
          Active Jobs
        </p>
      </div>

      <div>
        <h2 className="text-5xl font-black">
          1000+
        </h2>
        <p className="mt-2 text-lg opacity-90">
          Companies
        </p>
      </div>

      <div>
        <h2 className="text-5xl font-black">
          25000+
        </h2>
        <p className="mt-2 text-lg opacity-90">
          Candidates
        </p>
      </div>

      <div>
        <h2 className="text-5xl font-black">
          98%
        </h2>
        <p className="mt-2 text-lg opacity-90">
          Success Rate
        </p>
      </div>

    </div>

  </div>

</section>



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
  className="
  bg-white dark:bg-gray-900
  border border-gray-200 dark:border-gray-800
  p-8
  rounded-[32px]
  shadow-lg
  hover:shadow-2xl
  hover:-translate-y-2
  transition-all duration-300
"
>

                <div className="flex items-center justify-between mb-6">

  <div className="flex items-center gap-4">

    <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
      {job.title?.charAt(0)}
    </div>

    <div>

      <p className="font-semibold text-gray-500 text-sm">
        JobHub Verified
      </p>

      <p className="text-sm text-gray-400">
        Posted Recently
      </p>

    </div>

  </div>

  <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
    Active
  </span>

</div>

                <p className="mt-8 text-gray-600 dark:text-white text-lg leading-9">
                  {job.description}
                </p>

                <p className="mt-8 text-xl font-semibold dark:text-gray-200">
                  📍 {job.location}
                </p>
                <div className="flex flex-wrap gap-3 mt-5">

  <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
    Full Time
  </span>

  <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold">
    Immediate Hiring
  </span>

  <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold">
    Verified
  </span>

</div>

                <div className="mt-6">

  <p className="text-sm text-gray-500">
    Salary Package
  </p>

  <p className="text-3xl font-black text-green-600">
    ₹{job.salary}
  </p>

</div>

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
<Footer />
    </main>

  );

}