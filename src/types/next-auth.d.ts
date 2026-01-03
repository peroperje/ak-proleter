import { UserRole } from "@prisma/client"
import { type DefaultSession } from "next-auth"

export type ExtendedUser = DefaultSession["user"] & {
    role: UserRole
    id: string
}

declare module "next-auth" {
    interface Session {
        user: ExtendedUser
    }

    interface User {
        role?: UserRole
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role?: UserRole
    }
}

// In NextAuth v5, we often need to extend the core types
declare module "@auth/core/types" {
    interface User {
        role?: UserRole
    }
}

declare module "@auth/core/adapters" {
    interface AdapterUser {
        role?: UserRole
    }
}

declare module "@auth/core/jwt" {
    interface JWT {
        role?: UserRole
    }
}
