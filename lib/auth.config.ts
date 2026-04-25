// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";

// export const { handlers, auth, signIn, signOut } = NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//   ],

//   callbacks: {
//     async signIn({ user }) {
//       console.log("[SIGNIN CALLBACK] allowing:", user?.email);
//       return true;
//     },

//     async jwt({ token, account, user }) {
//       if (account?.provider === "google" && user) {
//         token.email = user.email;
//         token.name = user.name;
//         token.picture = user.image;
//       }
//       return token;
//     },

//     async session({ session, token }) {
//       return session;
//     },
//   },

//   pages: {
//     signIn: "/auth/login",
//     error: "/auth/error",
//   },

//   session: { strategy: "jwt" },
// });
















import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],

    callbacks: {
        async signIn({ user }) {
            try {
                const adminUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://sportsfan360.vercel.app";
                const res = await fetch(`${adminUrl}/api/auth/google-signup`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: user.email,
                        name: user.name,
                        avatar: user.image,
                    }),
                });
                if (res.status === 403) return false;
                return true;
            } catch (error) {
                console.error("[Google signIn] error:", error);
                return true;
            }
        },

        async jwt({ token, user, account }) {
            if (account?.provider === "google" && user?.email) {
                try {
                    const adminUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://sportsfan360.vercel.app";
                    const res = await fetch(`${adminUrl}/api/auth/google-signup`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: user.email,
                            name: user.name,
                            avatar: user.image,
                        }),
                    });
                    const data = await res.json();
                    token.dbUser = {
                        email: user.email,
                        userId: data.userId,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        role: data.role || "user",
                        status: data.status || "active",
                    };
                } catch (error) {
                    console.error("[JWT] error:", error);
                }
            }
            return token;
        },

        async session({ session, token }) {
            if (token.dbUser) {
                session.user = {
                    ...session.user,
                    ...(token.dbUser as object),
                };
            }
            return session;
        },
    },

    pages: {
        signIn: "/auth/login",
        error: "/auth/login",
    },

    session: { strategy: "jwt" },
});