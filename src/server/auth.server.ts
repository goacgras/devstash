import GitHub from "@auth/core/providers/github";
import type { AuthConfig } from "@auth/core/types";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "#/db";

export const authConfig = {
	basePath: "/api/auth",
	adapter: PrismaAdapter(prisma),
	providers: [
		GitHub({
			clientId: process.env.AUTH_GITHUB_ID,
			clientSecret: process.env.AUTH_GITHUB_SECRET,
		}),
	],
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
