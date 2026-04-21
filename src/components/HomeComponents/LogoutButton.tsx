

// "use client";
// import { signOut } from "next-auth/react";
// import axios from "axios";
// import { LogOut } from "lucide-react";

// export default function LogoutButton() {
//   const handleLogout = async () => {
//     try {
//       await axios.post("/api/auth/logout", {}, { withCredentials: true });
//     } catch (e) {
//       console.warn("Backend logout failed, continuing with client logout", e);
//     }

//     document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
//     localStorage.removeItem("watchalong_user_name");

//     // Uses current domain automatically — works on both localhost and production
//     await signOut({ callbackUrl: `${window.location.origin}/auth/login`, redirect: true });
//   };

//   return (
//     <button
//       onClick={handleLogout}
//       className="text-sm text-red-400 hover:text-red-300 cursor-pointer transition"
//     >
//       <LogOut size={16} />
//     </button>
//   );
// }




"use client";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

export default function LogoutButton() {
  const pathname = usePathname();

  const handleLogout = async () => {
    // Clear manual token cookie
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "token=; path=/; domain=localhost; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    localStorage.removeItem("watchalong_user_name");

    // Determine base URL
    const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
    const baseUrl = isLocalhost 
      ? 'http://localhost:3000'
      : 'https://sportsfan-frontend.vercel.app';
    
    const callbackUrl = `${baseUrl}/auth/login`;
    
    console.log('Logging out, redirecting to:', callbackUrl);
    
    await signOut({ callbackUrl, redirect: true });
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-red-400 hover:text-red-300 cursor-pointer transition flex items-center gap-1"
    >
      <LogOut size={16} />
      Logout
    </button>
  );
}