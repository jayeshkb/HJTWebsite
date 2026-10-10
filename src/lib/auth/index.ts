import { prismaAdapter } from "better-auth/adapters/prisma";
import { betterAuth } from "better-auth";
import { twoFactor } from "better-auth/plugins";
import { prisma } from "@/lib/db/prisma";

const authSecret = process.env.BETTER_AUTH_SECRET;

if (process.env.NODE_ENV === "production" && (!authSecret || authSecret.length < 32)) {
  throw new Error("BETTER_AUTH_SECRET must be at least 32 characters in production.");
}

const siteUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

export const auth = betterAuth({
  appName: "Hindu-Jain Temple Administration",
  baseURL: siteUrl,
  secret: authSecret,
  trustedOrigins: [siteUrl],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
  },
  session: {
    expiresIn: 60 * 60 * 8,
    updateAge: 60 * 30,
  },
  plugins: [twoFactor({ issuer: "Hindu-Jain Temple" })],
});