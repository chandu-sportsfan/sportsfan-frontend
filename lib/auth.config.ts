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
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

        const response = await fetch(
          `${backendUrl}/api/auth/google-sync`,
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

        // ✅ Log the actual error message from backend
        const responseBody = await response.text();
        console.log("[SIGNIN CALLBACK] status:", response.status, "body:", responseBody);

        if (response.status === 403) return false;

        // ✅ Allow login regardless — don't block on 400
        return true;

      } catch (err) {
        console.error("[SIGNIN CALLBACK] error:", err);
        return true;
      }
    },

    async jwt({ token, account, user }) {
      if (account?.provider === "google" && user) {
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
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

  debug: true,
});


