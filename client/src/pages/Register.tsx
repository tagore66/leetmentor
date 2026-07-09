import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const calculateStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score += 1;
    if (/\d/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const getStrengthData = (score: number) => {
    if (score === 0) return { text: "", color: "bg-neutral-800", labelColor: "text-transparent" };
    if (score === 1) return { text: "Weak", color: "bg-red-500", labelColor: "text-red-400" };
    if (score === 2) return { text: "Fair", color: "bg-orange-500", labelColor: "text-orange-400" };
    if (score === 3) return { text: "Good", color: "bg-yellow-500", labelColor: "text-yellow-400" };
    return { text: "Strong", color: "bg-green-500", labelColor: "text-green-400" };
  };

  const strengthScore = calculateStrength(password);
  const strengthData = getStrengthData(strengthScore);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (strengthScore < 4) {
      setError("Password must be strong (at least 8 chars, uppercase, lowercase, number, special char).");
      return;
    }

    try {
      await api.post("/auth/register", { name, email, password });
      
      // Auto-login after registration
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
      setError("Google Signup failed");
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
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-100">Create an account</h1>
          <p className="text-neutral-500 mt-2 text-sm">Join LeetMentor to supercharge your prep</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <div className="flex justify-center mb-6">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google Signup Failed")}
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

        <form onSubmit={handleRegister} className="space-y-3">
          <input
            className="w-full p-3.5 rounded-xl bg-neutral-900/50 border border-neutral-800 outline-none focus:border-neutral-600 focus:bg-neutral-900 text-neutral-100 transition-all text-sm placeholder:text-neutral-500"
            placeholder="Full Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            className="w-full p-3.5 rounded-xl bg-neutral-900/50 border border-neutral-800 outline-none focus:border-neutral-600 focus:bg-neutral-900 text-neutral-100 transition-all text-sm placeholder:text-neutral-500"
            placeholder="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div>
            <input
              className="w-full p-3.5 rounded-xl bg-neutral-900/50 border border-neutral-800 outline-none focus:border-neutral-600 focus:bg-neutral-900 text-neutral-100 transition-all text-sm placeholder:text-neutral-500"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {password && (
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] text-neutral-500 font-medium tracking-wide uppercase">Password Strength</span>
                  <span className={`text-[11px] font-bold ${strengthData.labelColor}`}>{strengthData.text}</span>
                </div>
                <div className="flex gap-1 h-1 w-full">
                  {[1, 2, 3, 4].map((level) => (
                    <div 
                      key={level} 
                      className={`flex-1 rounded-full transition-colors duration-300 ${strengthScore >= level ? strengthData.color : 'bg-neutral-800'}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>



          <button
            className="w-full bg-white text-black py-3.5 mt-2 rounded-xl font-medium text-sm hover:bg-neutral-200 transition-colors"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-neutral-500 text-sm mt-8">
          Already have an account?{" "}
          <Link to="/login" className="text-white hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}