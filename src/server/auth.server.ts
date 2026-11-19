import { CredentialsSignin } from "@auth/core/errors";
import Credentials from "@auth/core/providers/credentials";
import GitHub from "@auth/core/providers/github";
import type { AuthConfig } from "@auth/core/types";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "#/db";
import { isEmailVerificationEnabled } from "./email-verification.server";

class EmailNotVerifiedError extends CredentialsSignin {
	code = "EmailNotVerified";
}

export const authConfig = {
	basePath: "/api/auth",
	adapter: PrismaAdapter(prisma),
	providers: [
		GitHub({
			clientId: process.env.AUTH_GITHUB_ID,
			clientSecret: process.env.AUTH_GITHUB_SECRET,
		}),
		Credentials({
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				const email =
					typeof credentials?.email === "string" ? credentials.email : "";
				const password =
					typeof credentials?.password === "string" ? credentials.password : "";
				if (!email || !password) {
					return null;
				}

				const user = await prisma.user.findUnique({ where: { email } });
				if (!user?.password) {
					return null;
				}

				const isValid = await bcrypt.compare(password, user.password);
				if (!isValid) {
					return null;
				}

				if (isEmailVerificationEnabled() && !user.emailVerified) {
					throw new EmailNotVerifiedError();
				}

				return {
					id: user.id,
					name: user.name,
					email: user.email,
					image: user.image,
				};
			},
		}),
	],
	pages: { signIn: "/sign-in" },
	secret: process.env.AUTH_SECRET,
	trustHost: true,
	session: { strategy: "jwt" },
	callbacks: {
		session({ session, token }) {
			if (session.user && token.sub) {
				session.user.id = token.sub;
			}
			return session;
		},
	},
} satisfies AuthConfig;
