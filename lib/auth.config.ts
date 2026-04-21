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

        // If account is disabled, block sign in
        if (response.status === 403) return false;

        return true;
      } catch {
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
    error: "/auth/error",  // ← separate error page so you can see errors
  },

  session: { strategy: "jwt" },
});