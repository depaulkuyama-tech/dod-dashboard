// src/pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // DEMO USER (temporary)
        const demoUser = {
          id: "1",
          name: "Admin Officer",
          email: "admin@mod.gov.pg",
          password: "Admin@123",
        };

        if (
          credentials?.email === demoUser.email &&
          credentials?.password === demoUser.password
        ) {
          return {
            id: demoUser.id,
            name: demoUser.name,
            email: demoUser.email,
          };
        }

        return null; // invalid login
      },
    }),
  ],

  pages: {
    signIn: "/auth/signin",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET || "dev-secret",
});
