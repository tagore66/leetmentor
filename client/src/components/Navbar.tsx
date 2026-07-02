import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-slate-950/50 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-5">

        <Link
          to="/"
          className="text-3xl font-extrabold text-cyan-400 tracking-wide"
        >
          LeetMentor AI
        </Link>

        <div className="flex items-center gap-8">

          <Link
            to="/login"
            className="text-gray-300 hover:text-cyan-400 duration-300"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-xl bg-cyan-500 px-5 py-2 font-semibold text-black hover:scale-105 duration-300"
          >
            Get Started
          </Link>

        </div>

      </div>
    </nav>
  );
}