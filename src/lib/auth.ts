import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/db";
import { account, session, user, verification } from "../db/schema";
import { sendEmail } from "./email";
import { APP_URL } from "../consts/paths";

export const auth = betterAuth({
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github"],
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async (user, url, token) => {
      const redirectUrl = `${APP_URL}/api/verify-email?token=${token}`;
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        html: `Click the link to verify your email: ${redirectUrl}`,
      });
    },
  },
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      user: user,
      account: account,
      session: session,
      verification: verification,
    },
  }),
});
