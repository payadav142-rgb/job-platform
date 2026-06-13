import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="grid md:grid-cols-4 gap-10">

          <div>
            <h2 className="text-3xl font-bold">
              <span className="text-orange-500">Job</span>Hub
            </h2>

            <p className="mt-4 text-gray-500">
              Find jobs, internships and career opportunities
              with AI-powered tools.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-4">Jobs</h3>

            <div className="flex flex-col gap-2">
              <Link href="/">Browse Jobs</Link>
              <Link href="/">Remote Jobs</Link>
              <Link href="/">Internships</Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4">Resources</h3>

            <div className="flex flex-col gap-2">
              <Link href="/">Resume Builder</Link>
              <Link href="/">Resume Analyzer</Link>
              <Link href="/">AI Match Score</Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4">Company</h3>

            <div className="flex flex-col gap-2">
              <Link href="/">About</Link>
              <Link href="/">Contact</Link>
              <Link href="/">Privacy Policy</Link>
            </div>
          </div>

        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500">
          © 2026 JobHub. All Rights Reserved.
        </div>

      </div>
    </footer>
  );
}