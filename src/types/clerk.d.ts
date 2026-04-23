import type { UserRole } from "@/types";

declare global {
  interface ClerkAuthorization {
    permission: "";
    role: "";
  }

  interface UserPublicMetadata {
    role?: UserRole;
  }

  interface CustomJwtSessionClaims {
    metadata?: {
      role?: UserRole;
    };
  }
}

export {};
