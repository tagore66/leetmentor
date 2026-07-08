import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.user, res.data.token);
      navigate("/ai");
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const res = await api.post("/auth/google", {
        token: credentialResponse.credential,
      });
      login(res.data.user, res.data.token);
      navigate("/ai");
    } catch (err: any) {
      setError("Google Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-black flex justify-center items-center relative font-sans text-white">
      {/* Premium minimal glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 blur-[120px] rounded-full pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-[400px] p-8 z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-100">Welcome back</h1>
          <p className="text-neutral-500 mt-2 text-sm">Sign in to your LeetMentor account</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <div className="flex justify-center mb-6">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google Login Failed")}
            theme="filled_black"
            shape="rectangular"
            text="continue_with"
            width="336"
          />
        </div>

        <div className="relative flex items-center py-5">
          <div className="flex-grow border-t border-neutral-800"></div>
          <span className="flex-shrink-0 mx-4 text-neutral-600 text-xs uppercase tracking-widest font-medium">Or</span>
          <div className="flex-grow border-t border-neutral-800"></div>
        </div>

        <form onSubmit={handleLogin} className="space-y-3">
          <input
            className="w-full p-3.5 rounded-xl bg-neutral-900/50 border border-neutral-800 outline-none focus:border-neutral-600 focus:bg-neutral-900 text-neutral-100 transition-all text-sm placeholder:text-neutral-500"
            placeholder="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className="w-full p-3.5 rounded-xl bg-neutral-900/50 border border-neutral-800 outline-none focus:border-neutral-600 focus:bg-neutral-900 text-neutral-100 transition-all text-sm placeholder:text-neutral-500"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            className="w-full bg-white text-black py-3.5 mt-2 rounded-xl font-medium text-sm hover:bg-neutral-200 transition-colors"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-neutral-500 text-sm mt-8">
          Don't have an account?{" "}
          <Link to="/register" className="text-white hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}