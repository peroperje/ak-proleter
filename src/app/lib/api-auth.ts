import { auth } from "@/auth";
import { verifyToken } from "@/app/lib/jwt";
import { headers } from "next/headers";
import { UserRole } from "@prisma/client";

export async function getApiSession() {
  // 1. Try Cookie Session (NextAuth)
  const session = await auth();
  if (session?.user) {
      return {
          user: {
              id: session.user.id,
              email: session.user.email,
              name: session.user.name,
              role: session.user.role as UserRole,
          }
      };
  }

  // 2. Try Bearer Token (mostly for mobile apps)
  const authHeader = (await headers()).get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    const decoded = await verifyToken(token);
    
    if (decoded && decoded.id) {
        return { 
          user: {
            id: decoded.id as string,
            email: decoded.email as string,
            name: decoded.name as string,
            role: (decoded.role as UserRole) || UserRole.USER,
          } 
        };
    }
  }
  
  return null;
}
