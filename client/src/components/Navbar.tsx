import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-slate-900 text-white flex justify-between items-center px-8 py-4 shadow-lg">

      <h1 className="text-2xl font-bold text-cyan-400">
        LeetMentor
      </h1>

      <div className="flex items-center gap-6">

        <span className="text-slate-300">
          {user?.name}
        </span>

        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
        >
          Logout
        </button>
          <button
    onClick={() => navigate("/ai")}
    className="text-cyan-400 hover:text-cyan-300"
>
    AI Workspace
</button>
      </div>

    </nav>
  );
}