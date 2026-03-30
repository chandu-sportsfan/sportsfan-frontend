"use client";
import { signOut } from "next-auth/react";
import axios from "axios";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const handleLogout = async () => {
    // 1. Clear manual JWT cookie
    await axios.post("/api/auth/logout");
    
    // 2. Clear Google OAuth session
    await signOut({ callbackUrl: "/auth/login" });
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