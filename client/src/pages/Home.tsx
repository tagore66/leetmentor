import Navbar from "../components/Navbar";
import FeatureCard from "../components/FeatureCard";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="bg-slate-950 text-white overflow-hidden">

      <Navbar />

      <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-6">

        <div className="absolute w-96 h-96 bg-cyan-500 rounded-full blur-[180px] opacity-20 top-20 left-20"></div>

        <div className="absolute w-80 h-80 bg-blue-600 rounded-full blur-[180px] opacity-20 bottom-20 right-20"></div>

        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-7xl md:text-8xl font-black"
        >
          Master{" "}
          <span className="text-cyan-400">
            LeetCode
          </span>{" "}
          with AI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: .4 }}
          className="mt-8 max-w-3xl text-xl text-slate-400"
        >
          Learn faster using AI code reviews, interview simulations,
          personalized hints and progress analytics.
        </motion.p>

        <motion.div
          initial={{ opacity:0 }}
          animate={{ opacity:1 }}
          transition={{ delay:.8 }}
          className="flex gap-5 mt-10"
        >
          <button className="bg-cyan-400 text-black px-8 py-4 rounded-full font-bold hover:scale-105 transition">
            Get Started
          </button>

          <button className="border border-slate-700 px-8 py-4 rounded-full hover:bg-slate-800 transition">
            View GitHub
          </button>
        </motion.div>

      </section>

      <section className="max-w-7xl mx-auto py-28 px-6">

        <h2 className="text-5xl font-bold text-center mb-16">
          Everything You Need
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          <FeatureCard
            title="AI Code Review"
            description="Understand mistakes instantly with AI-powered reviews."
          />

          <FeatureCard
            title="Interview Simulator"
            description="Practice coding interviews with realistic AI feedback."
          />

          <FeatureCard
            title="Progress Analytics"
            description="Track streaks, strengths, weaknesses and growth."
          />

          <FeatureCard
            title="AI Hints"
            description="Get hints that guide your thinking instead of revealing answers."
          />

        </div>

      </section>
      <section className="py-24">

    <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 text-center gap-10">

        <div>
            <h1 className="text-5xl font-bold text-cyan-400">10K+</h1>
            <p className="text-slate-400 mt-2">Problems Solved</p>
        </div>

        <div>
            <h1 className="text-5xl font-bold text-cyan-400">95%</h1>
            <p className="text-slate-400 mt-2">Interview Success</p>
        </div>

        <div>
            <h1 className="text-5xl font-bold text-cyan-400">24/7</h1>
            <p className="text-slate-400 mt-2">AI Assistance</p>
        </div>

        <div>
            <h1 className="text-5xl font-bold text-cyan-400">500+</h1>
            <p className="text-slate-400 mt-2">Daily Users</p>
        </div>

    </div>

</section>

    </div>
  );
}