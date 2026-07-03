import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <Navbar />

      <div className="max-w-6xl mx-auto p-10">
        <div className="grid grid-cols-3 gap-6 mt-12">

            <div className="bg-slate-900 rounded-xl p-6">
                <h2 className="text-slate-400">Easy</h2>
                <p className="text-4xl font-bold mt-3 text-green-400">
                0
                </p>
            </div>

            <div className="bg-slate-900 rounded-xl p-6">
                <h2 className="text-slate-400">Medium</h2>
                <p className="text-4xl font-bold mt-3 text-yellow-400">
                0
                </p>
            </div>

            <div className="bg-slate-900 rounded-xl p-6">
                <h2 className="text-slate-400">Hard</h2>
                <p className="text-4xl font-bold mt-3 text-red-400">
                0
                </p>
            </div>

        </div>
        <div className="bg-slate-900 rounded-xl p-8 mt-10">

    <h2 className="text-3xl font-bold text-cyan-400">
        Today's Challenge
    </h2>

    <p className="text-slate-400 mt-2">
        Solve one problem today to keep your streak alive.
    </p>

    <div className="mt-6">

        <h3 className="text-2xl font-semibold">
            Two Sum
        </h3>

        <p className="text-green-400 mt-2">
            Difficulty: Easy
        </p>

        <button
            className="mt-6 bg-cyan-400 text-black px-6 py-3 rounded-lg font-bold hover:bg-cyan-300"
        >
            Solve Now
        </button>

    </div>

</div>
<div className="bg-slate-900 rounded-xl p-8 mt-10">

    <h2 className="text-3xl font-bold text-cyan-400">
        Recent Activity
    </h2>

    <ul className="mt-6 space-y-4">

        <li>✅ Solved Two Sum</li>

        <li>✅ Solved Valid Parentheses</li>

        <li>🔥 5 Day Streak</li>

    </ul>

</div>
<div className="bg-slate-900 rounded-xl p-8 mt-10">

    <h2 className="text-3xl font-bold text-cyan-400">
        Daily Goal
    </h2>

    <div className="mt-6">

        <div className="w-full bg-slate-700 rounded-full h-4">

            <div
                className="bg-green-400 h-4 rounded-full"
                style={{ width: "60%" }}
            />

        </div>

        <p className="mt-3">
            3 / 5 Problems Solved
        </p>

    </div>

</div>
        <h1 className="text-5xl font-bold text-cyan-400">
          Welcome, {user?.name}
        </h1>

        <p className="text-slate-400 mt-3">
          Ready to level up your DSA today?
        </p>

      </div>

    </div>
  );
}