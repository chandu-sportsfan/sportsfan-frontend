import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  // ↓ ADD THIS
  logger: {
    error(error) {
      console.error("[NEXTAUTH ERROR]", error);
    },
    warn(code) {
      console.warn("[NEXTAUTH WARN]", code);
    },
    debug(code, metadata) {
      console.log("[NEXTAUTH DEBUG]", code, metadata);
    },
  },

  // ↓ ADD THIS - helps diagnose config issues
  debug: true,

  callbacks: {
    async signIn({ user }) {
      console.log("[SIGNIN CALLBACK] user:", user); // ← add this
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google-sync`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              image: user.image,
            }),
          }
        );
        console.log("[SIGNIN CALLBACK] sync response status:", response.status);
        if (response.status === 403) return false;
        return true;
      } catch (err) {
        console.error("[SIGNIN CALLBACK] fetch error:", err); // ← and this
        return false;
      }
    },

    async jwt({ token, account, user }) {
      if (account?.provider === "google" && user) {
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },

  session: { strategy: "jwt" },
});