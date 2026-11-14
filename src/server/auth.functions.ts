import { Auth } from "@auth/core";
import type { Session } from "@auth/core/types";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { authConfig } from "#/server/auth.server";
import type { CurrentUser } from "#/types/auth";

export const getCurrentUser = createServerFn({ method: "GET" }).handler(
	async (): Promise<CurrentUser | null> => {
		const request = getRequest();
		const sessionUrl = new URL("/api/auth/session", request.url);
		const response = await Auth(
			new Request(sessionUrl, { headers: request.headers }),
			authConfig,
		);
		const session = (await response.json()) as Session | null;

		if (!session?.user?.id) {
			return null;
		}

		return {
			id: session.user.id,
			name: session.user.name ?? null,
			email: session.user.email ?? null,
			image: session.user.image ?? null,
		};
	},
);
