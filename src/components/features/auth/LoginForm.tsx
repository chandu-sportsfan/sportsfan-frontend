// "use client";

// import axios from "axios";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// export default function LoginCard() {
//    const [showPassword, setShowPassword] = useState(false);
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");

//     const router = useRouter();

//      const handleLogin = async () => {
//         if (!email || !password) {
//             setError("Please enter email & password");
//             return;
//         }

//         try {
//             setLoading(true);
//             setError("");

//             const res = await axios.post(
//                 "/api/auth/login",
//                 { email, password },
//                 { withCredentials: true } // 🔥 important for cookies
//             );

//             if (res.data.success) {
//                 // ✅ redirect
//                 router.push("/app/MainModules/HomePage");
//             }

//         } catch (err: unknown) {
//             if(err instanceof Error) {
//                 setError(err.message);
//             } else {
//                 setError("Login failed");
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div
//             className="min-h-screen w-full flex flex-col items-center justify-center gap-6 relative
//       bg-gradient-to-b from-[#3a0000] via-black to-[#120000]"
//         >
//             {/* Glow */}
//             <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-transparent to-orange-600/20 pointer-events-none" />
//             {/* Logo + Title BELOW */}
//             <div className="flex flex-col items-center z-10">
//                 <img src="/images/Logo.png" alt="logo" className="lg:w-[56px] lg:h-[66.66px] mb-2" />

//                 <h1 className="text-white text-2xl font-semibold text-center">
//                     Welcome back!
//                 </h1>
//             </div>

//             {/* Card */}
//             <div className="relative z-10 w-full max-w-sm px-5 py-8 rounded-3xl
//         bg-[#222222] backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.8)]">

//                 {/* Inputs */}
//                 <div className="rounded-2xl p-3 space-y-3 mb-6">
//                     <input
//                         type="text"
//                         placeholder="Phone Number / Email"
//                         className="w-full bg-black/40 text-white px-4 py-3 rounded-xl text-sm outline-none placeholder:text-gray-500"
//                     />

//                     <div className="relative">
//                         <input
//                             type={showPassword ? "text" : "password"}
//                             placeholder="Password"
//                             className="w-full bg-black/40 text-white px-4 py-3 rounded-xl text-sm outline-none placeholder:text-gray-500 pr-10"
//                         />

//                         <button
//                             onClick={() => setShowPassword(!showPassword)}
//                             className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
//                         >
//                             👁
//                         </button>
//                     </div>
//                 </div>

//                 {/* Continue */}
//                 {/* <button className="w-full bg-gray-300 text-black py-3 rounded-full font-medium mb-6 hover:bg-white transition">
//                     Continue
//                 </button> */}
//                     <button
//                     onClick={handleLogin}
                   
//                     className="w-full bg-gray-300 text-black py-3 rounded-full font-medium mb-6 hover:bg-white transition"
//                 >
//                    continue
//                     {/* {loading ? "Logging in..." : "Continue"} */}
//                 </button>

//                 {/* OR */}
//                 <div className="flex items-center gap-3 mb-6">
//                     <div className="flex-1 h-[1px] bg-gray-700" />
//                     <span className="text-gray-500 text-xs tracking-widest">OR</span>
//                     <div className="flex-1 h-[1px] bg-gray-700" />
//                 </div>

//                 {/* Google */}
//                 <button className="w-full bg-white text-black py-3 rounded-full font-medium flex items-center justify-center gap-2 mb-6">
//                     <span className="text-lg">G</span>
//                     Continue with Google
//                 </button>

//                 {/* Signup */}
//                 <p className="text-gray-300 text-sm text-center">
//                     Don&apos;t have an account?{" "}
//                     <Link href="/auth/register">
//                         <span className="font-semibold text-white cursor-pointer">
//                             Sign Up
//                         </span>
//                     </Link>
//                 </p>
//             </div>


//         </div>
//     );
// }










"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginCard() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const router = useRouter();

    const handleLogin = async () => {
        if (!email || !password) {
            setError("Please enter email & password");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const res = await axios.post(
                "/api/auth/login",
                { email, password },
                { withCredentials: true }
            );

            if (res.data.success) {
                router.push("/MainModules/HomePage");
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else if (axios.isAxiosError(err)) {
                setError(err.response?.data?.error || "Login failed");
            } else {
                setError("Login failed");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen w-full flex flex-col items-center justify-center gap-6 relative
      bg-gradient-to-b from-[#3a0000] via-black to-[#120000]"
        >
            {/* Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-transparent to-orange-600/20 pointer-events-none" />
            
            {/* Logo + Title */}
            <div className="flex flex-col items-center z-10">
                <img src="/images/Logo.png" alt="logo" className="lg:w-[56px] lg:h-[66.66px] mb-2" />
                <h1 className="text-white text-2xl font-semibold text-center">
                    Welcome back!
                </h1>
            </div>

            {/* Card */}
            <div className="relative z-10 w-[300px] md:w-full max-w-sm px-5 py-8 rounded-3xl
        bg-[#222222] backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.8)]">

                {/* Inputs */}
                <div className="rounded-2xl p-3 space-y-3 mb-6">
                    <input
                        type="email"
                        placeholder="Email Address"
                        className="w-full bg-black/40 text-white px-4 py-3 rounded-xl text-sm outline-none placeholder:text-gray-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    />

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="w-full bg-black/40 text-white px-4 py-3 rounded-xl text-sm outline-none placeholder:text-gray-500 pr-10"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                            👁
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <p className="text-red-400 text-sm text-center mb-4">{error}</p>
                )}

                {/* Continue Button */}
                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full bg-gray-300 text-black py-3 rounded-full font-medium mb-6 hover:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Logging in..." : "Continue"}
                </button>

                {/* OR */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex-1 h-[1px] bg-gray-700" />
                    <span className="text-gray-500 text-xs tracking-widest">OR</span>
                    <div className="flex-1 h-[1px] bg-gray-700" />
                </div>

                {/* Google */}
                <button className="w-full bg-white text-black py-3 rounded-full font-medium flex items-center justify-center gap-2 mb-6">
                    <span className="text-lg">G</span>
                    Continue with Google
                </button>

                {/* Signup */}
                <p className="text-gray-300 text-sm text-center">
                    Don&apos;t have an account?{" "}
                    <Link href="/auth/register">
                        <span className="font-semibold text-white cursor-pointer">
                            Sign Up
                        </span>
                    </Link>
                </p>
            </div>
        </div>
    );
}