import { BrowserRouter, Routes, Route } from "react-router-dom";

import AIWorkspace from "../pages/AIWorkspace";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import Account from "../pages/Account";

import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/ai"
          element={
            <ProtectedRoute>
              <AIWorkspace />
            </ProtectedRoute>
          }
        />

        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
        
        {/* Redirect old routes */}
        <Route path="/profile" element={<Account />} />
        <Route path="/settings" element={<Account />} />

        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}