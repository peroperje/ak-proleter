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
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const user = auth?.user as any
            const role = user?.role
            const pathname = nextUrl.pathname

            const isPublicRoute = ["/login", "/register"].includes(pathname)

            const isAdminRoute =
                ["/athletes", "/events", "/results", "/admin-dashboard"].includes(pathname) ||
                pathname.startsWith("/athletes/new") ||
                pathname.startsWith("/events/new") ||
                pathname.startsWith("/results/new") ||
                pathname.includes("/edit")

            // If it's a public route and user is logged in, redirect to home
            if (isPublicRoute) {
                if (isLoggedIn) return Response.redirect(new URL("/", nextUrl))
                return true
            }

            // If it's not a public route, user MUST be logged in
            if (!isLoggedIn) return false // This will redirect to /login

            // If it's an admin route, user MUST be admin
            if (isAdminRoute && role !== "ADMIN") {
                return Response.redirect(new URL("/", nextUrl))
            }

            return true
        },
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
