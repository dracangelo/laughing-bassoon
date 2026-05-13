import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { userSchema } from "@/validators/userSchema";
import { authenticateUser } from "@/lib/auth";

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
        const user = await authenticateUser(parsed.data.email, parsed.data.password);
        if (!user) return null;
        return { id: String(user.id), email: user.email, role: user.role };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as { role?: string }).role;
      return token;
    },
    async session({ session, token }) {
      return { ...session, user: { ...session.user, role: token.role } } as typeof session;
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
