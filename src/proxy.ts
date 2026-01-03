import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

const { auth } = NextAuth(authConfig)

export const proxy = auth((req) => {
    const isLoggedIn = !!req.auth
    const { nextUrl } = req

    const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
    const isPublicRoute = ["/", "/about"].includes(nextUrl.pathname)
    const isAuthRoute = ["/login", "/register"].includes(nextUrl.pathname)

    if (isApiAuthRoute) return undefined

    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL("/", nextUrl))
        }
        return undefined
    }

    if (!isLoggedIn && !isPublicRoute) {
        return Response.redirect(new URL("/login", nextUrl))
    }

    // Handle ADMIN route protection
    if (nextUrl.pathname.startsWith("/admin") && req.auth?.user?.role !== "ADMIN") {
        return Response.redirect(new URL("/", nextUrl))
    }

    return undefined
})

export default proxy

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
