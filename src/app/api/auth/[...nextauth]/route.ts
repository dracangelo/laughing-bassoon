import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { userSchema } from "@/validators/userSchema";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const parsed = userSchema.pick({ email: true, password: true }).safeParse(credentials);
        if (!parsed.success) return null;

        const demoHash = await bcrypt.hash("ChangeMe12345!", 10);
        const allowed = parsed.data.email === "admin@aceturbo.co.uk" && await bcrypt.compare(parsed.data.password, demoHash);
        if (!allowed) return null;
        return { id: "1", email: parsed.data.email, role: "admin" };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = "admin";
      return token;
    },
    async session({ session, token }) {
      return { ...session, user: { ...session.user, role: token.role } } as typeof session;
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
