import User from "@/models/user";
import { connectDB } from "@/libs/mongodb";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith" },
        password: { label: "Password", type: "password", placeholder: "***" },
      },
      async authorize(credentials, req) {
        await connectDB();
        const userFound = await User.findOne({
          email: credentials?.email,
        }).select("+password");

        if (!userFound) {
          throw new Error("Invalid credentials");
        }

        const passwordMatch = await bcrypt.compare(
          credentials!.password,
          userFound.password
        );
        if (!passwordMatch) {
          throw new Error("Invalid credentials");
        }
        console.log(userFound);

        return userFound;
      },
    }),
  ],
  callbacks: {
    jwt({ account, user, token, profile, session }) {
      console.log(account, user, token, profile);
      if (user) token.user = user;
      return token;
    },
    session({ session, token }) {
      session.user = token.user as any;
      console.log(session, "hola", token);
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
