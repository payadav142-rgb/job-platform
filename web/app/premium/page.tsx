"use client";

export default function PremiumPage() {

  const activatePremium = async () => {

    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/activate-premium/${user.id}`,
      {
        method: "PUT"
      }
    );

    const data =
      await response.json();

    if (data.success) {

      const updatedUser = {
        ...user,
        isPremium: true
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      alert(
        "Premium Activated 👑"
      );

      window.location.href =
        "/post-job";

    } else {

      alert(
        "Activation Failed"
      );

    }

  };

  return (

    <main className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-10 rounded-3xl shadow-2xl w-[500px] text-center">

        <h1 className="text-4xl font-bold mb-4">
          Upgrade To Premium 👑
        </h1>

        <p className="text-gray-600 mb-8">
          Unlock Unlimited Job Posts 🚀
        </p>

        <div className="bg-yellow-100 p-6 rounded-2xl mb-6">

          <h2 className="text-2xl font-bold mb-3">
            Premium Benefits
          </h2>

          <ul className="space-y-2 text-left">

            <li>
              ✅ Unlimited Job Posts
            </li>

            <li>
              ✅ Premium Recruiter Badge
            </li>

            <li>
              ✅ Future AI Features
            </li>

            <li>
              ✅ Priority Access
            </li>

          </ul>

        </div>

        <button
          onClick={activatePremium}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 rounded-2xl transition-all duration-300"
        >
          Activate Premium 👑
        </button>

      </div>

    </main>

  );

}