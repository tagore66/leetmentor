import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">

      <Navbar />

      <div className="absolute w-96 h-96 bg-cyan-500 rounded-full blur-[180px] opacity-20 top-20 left-20"></div>

      <div className="absolute w-96 h-96 bg-blue-500 rounded-full blur-[180px] opacity-20 bottom-20 right-20"></div>

      <section className="relative flex flex-col justify-center items-center min-h-screen text-center px-6">

        <p className="text-cyan-400 uppercase tracking-[0.3em] font-semibold">
          AI Powered Learning
        </p>

        <h1 className="text-7xl font-black mt-6 leading-tight">

          Master{" "}

          <span className="text-cyan-400">

            LeetCode

          </span>

          <br />

          Like Never Before

        </h1>

        <p className="max-w-3xl mt-8 text-xl text-gray-400">

          Learn algorithms with AI explanations, progressive hints,
          interview simulations, personalized roadmaps,
          code reviews, and detailed visual dry runs.

        </p>

        <div className="mt-12 flex gap-6">

          <button className="rounded-xl bg-cyan-500 px-8 py-4 font-bold text-black hover:scale-105 duration-300">

            Get Started

          </button>

          <button className="rounded-xl border border-slate-700 px-8 py-4 hover:border-cyan-400 duration-300">

            Watch Demo

          </button>

        </div>

      </section>

    </div>
  );
}