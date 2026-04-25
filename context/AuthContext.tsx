// // context/AuthContext.tsx
// "use client";
// import { createContext, useContext, useEffect, useState, ReactNode } from "react";
// import axios from "axios";

// interface User {
//   email: string;
//   name: string;
//   role: string;
//   userId?: string;
// }

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   error: string | null;
//   isAuthenticated: boolean;
//   getUserName: () => string;
//   getUserDisplayName: () => string;
//   refreshUser: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchUser = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await axios.get("/api/auth/host/me");
      
//       if (response.data.success && response.data.user) {
//         setUser(response.data.user);
//         // Store user info in localStorage as backup
//         localStorage.setItem("auth_user", JSON.stringify(response.data.user));
//       } else {
//         setUser(null);
//         // Try to get from localStorage if API fails
//         const cachedUser = localStorage.getItem("auth_user");
//         if (cachedUser) {
//           setUser(JSON.parse(cachedUser));
//         }
//       }
//     } catch (err) {
//       console.error("Failed to fetch user:", err);
//       setError("Authentication failed");
//       // Try to get from localStorage as fallback
//       const cachedUser = localStorage.getItem("auth_user");
//       if (cachedUser) {
//         setUser(JSON.parse(cachedUser));
//       } else {
//         setUser(null);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUser();
//   }, []);

//   const refreshUser = async () => {
//     await fetchUser();
//   };

//   const getUserName = () => {
//     if (user?.name) {
//       // Convert to username format (no spaces, lowercase)
//       return user.name.toLowerCase().replace(/\s/g, "_");
//     }
//     // Fallback to cached or generate random
//     const cached = localStorage.getItem("audio_user_name");
//     if (cached) return cached;
//     return `fan_${Math.random().toString(36).substr(2, 5)}`;
//   };

//   const getUserDisplayName = () => {
//     if (user?.name) return user.name;
//     const cached = localStorage.getItem("audio_user_display");
//     if (cached) return cached;
//     return `Fan ${Math.random().toString(36).substr(2, 5)}`;
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         error,
//         isAuthenticated: !!user,
//         getUserName,
//         getUserDisplayName,
//         refreshUser,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// }









"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

interface User {
    email: string;
    name: string;
    role: string;
    userId?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    getUserName: () => string;
    getUserDisplayName: () => string;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getOrCreateGuestName(): string {
    if (typeof window === "undefined") return "Fan";
    const stored = localStorage.getItem("guest_display_name");
    if (stored) return stored;
    const name = `Fan_${Math.random().toString(36).substr(2, 5)}`;
    localStorage.setItem("guest_display_name", name);
    return name;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ── Google session from NextAuth ─────────────────────────────────────────
    const { data: session, status: sessionStatus } = useSession();

    const fetchUser = async () => {
        try {
            setLoading(true);
            setError(null);

            // ── 1. Try JWT cookie (email/OTP users) ──────────────────────────
            const response = await axios.get("/api/auth/host/me");

            if (response.data.success && response.data.user) {
                const u = response.data.user;
                // Build full name from name or firstName+lastName
                const fullName =
                    u.name ||
                    [u.firstName, u.lastName].filter(Boolean).join(" ").trim() ||
                    "";
                const normalised: User = {
                    email: u.email,
                    name: fullName,
                    role: u.role || "user",
                    userId: u.userId,
                };
                setUser(normalised);
                localStorage.setItem("auth_user", JSON.stringify(normalised));
                return;
            }
        } catch {
            // JWT check failed — fall through to Google session check
        }

        // ── 2. Try Google/NextAuth session ───────────────────────────────────
        if (session?.user?.email) {
            const googleUser: User = {
                email: session.user.email,
                name: session.user.name || session.user.email.split("@")[0],
                role: (session.user as { role?: string }).role || "user",
                userId: (session.user as { userId?: string }).userId,
            };
            setUser(googleUser);
            localStorage.setItem("auth_user", JSON.stringify(googleUser));
            setLoading(false);
            return;
        }

        // ── 3. Fallback: cached user ─────────────────────────────────────────
        const cachedUser = localStorage.getItem("auth_user");
        if (cachedUser) {
            setUser(JSON.parse(cachedUser));
        } else {
            setUser(null);
        }

        setLoading(false);
    };

    // Re-run when Google session loads
    useEffect(() => {
        if (sessionStatus === "loading") return; // wait for session
        fetchUser();
    }, [sessionStatus, session?.user?.email]);

    const refreshUser = async () => {
        await fetchUser();
    };

    const getUserDisplayName = (): string => {
        if (user?.name) return user.name;
        if (session?.user?.name) return session.user.name;
        return getOrCreateGuestName();
    };

    const getUserName = (): string => {
        return getUserDisplayName().toLowerCase().replace(/\s+/g, "_");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                error,
                isAuthenticated: !!user,
                getUserName,
                getUserDisplayName,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}