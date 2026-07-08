import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/Button";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;



  return (
    <nav className="bg-black/80 backdrop-blur-xl border-b border-neutral-900 text-white flex justify-between items-center px-8 py-4 relative z-10">

      <h1 
        onClick={() => navigate(user ? "/ai" : "/")}
        className="text-lg font-semibold tracking-tight cursor-pointer flex items-center gap-2"
      >
        <div className="w-5 h-5 bg-white rounded-sm"></div>
        LeetMentor
      </h1>

      <div className="flex items-center gap-8">
        {user ? (
          <>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => navigate("/ai")} className={isActive("/ai") ? "!text-white" : ""}>AI Workspace</Button>
              <Button variant="ghost" onClick={() => navigate("/account")} className={isActive("/account") ? "!text-white" : ""}>Account</Button>
            </div>

            <div className="h-4 w-px bg-neutral-800"></div>

            <Button variant="ghost" onClick={() => logout()}>
              Sign Out
            </Button>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Sign In
            </Button>
            <Button variant="primary" onClick={() => navigate("/register")}>
              Get Started
            </Button>
          </div>
        )}
      </div>

    </nav>
  );
}