import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Call your admin backend to create/update user in Firestore
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google-sync`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            name: user.name,
            image: user.image,
          }),
        });
        return true;
      } catch {
        return false;
      }
    },
    async jwt({ token, account, user }) {
      if (account?.provider === "google") {
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
    error: "/auth/login",
  },
  session: { strategy: "jwt" },
});

export { handler as GET, handler as POST };