import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();

  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res = await api.post("/auth/login", {
      email,
      password,
    });

    console.log("STEP 1", res.data);

    login(res.data.user, res.data.token);
    console.log("STEP 2");

    navigate("/dashboard");
    console.log("STEP 3");
  } catch (err: any) {
    console.log("ERROR", err);
    console.log("ERROR RESPONSE", err.response);
    console.log("ERROR MESSAGE", err.message);

    alert(err.message);
  }
};

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center items-center">

      <form
        onSubmit={handleLogin}
        className="bg-slate-900 p-10 rounded-xl w-[400px]"
      >

        <h1 className="text-4xl text-cyan-400 mb-8">
          Login
        </h1>

        <input
          className="w-full p-3 mb-4 rounded bg-slate-800"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-3 mb-6 rounded bg-slate-800"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-cyan-400 text-black py-3 rounded font-bold"
        >
          Login
        </button>

      </form>

    </div>
  );
}