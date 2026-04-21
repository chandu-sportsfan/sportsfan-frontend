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
      console.log("[SIGNIN CALLBACK] user:", user?.email);
      
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        console.log("[SIGNIN CALLBACK] calling backend:", backendUrl);

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

        console.log("[SIGNIN CALLBACK] backend response status:", response.status);

        // Only block login if explicitly 403
        if (response.status === 403) {
          console.log("[SIGNIN CALLBACK] blocked by backend 403");
          return false;
        }

        // Allow login for any other status including errors
        return true;

      } catch (err) {
        // ✅ Don't block login if backend is unreachable — allow it
        console.error("[SIGNIN CALLBACK] backend sync failed, allowing login anyway:", err);
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