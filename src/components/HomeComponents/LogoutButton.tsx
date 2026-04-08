"use client";
import { signOut, useSession } from "next-auth/react";
import axios from "axios";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const { data: session } = useSession();

  const handleLogout = async () => {
    try {
      // 1. Clear manual JWT cookie on the backend
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
    } catch (e) {
      console.warn("Backend logout failed, continuing with client logout", e);
    }
    
    // 2. Force remove local cookie just in case
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    localStorage.removeItem("watchalong_user_name");

    // 3. Clear Google OAuth session and redirect
    try {
      if (session) {
        await signOut({ callbackUrl: "/auth/login" });
      } else {
        window.location.href = "/auth/login";
      }
    } catch (e) {
      console.warn("NextAuth signOut failed, forcing redirect", e);
      window.location.href = "/auth/login";
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-red-400 hover:text-red-300"
    >
       <LogOut size={16} />
    </button>
  );
}