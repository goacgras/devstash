import { createFileRoute } from "@tanstack/react-router";
import { Auth } from "@auth/core";
import { authConfig } from "#/server/auth.server";

export const Route = createFileRoute("/api/auth/$")({
	server: {
		handlers: {
			GET: ({ request }) => Auth(request, authConfig),
			POST: ({ request }) => Auth(request, authConfig),
		},
	},
});
