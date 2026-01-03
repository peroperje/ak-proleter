import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"
import { UserRole } from "@prisma/client"

export const authConfig = {
    session: { strategy: "jwt" },
    pages: {
        signIn: "/login",
    },
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.role = user.role
                token.sub = user.id
            }

            if (trigger === "update" && session?.role) {
                token.role = session.role
            }

            return token
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }
            if (token.role && session.user) {
                session.user.role = token.role as UserRole
            }
            return session
        },
    },
} satisfies NextAuthConfig
