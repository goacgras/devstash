import { createFileRoute } from "@tanstack/react-router";
import { verifyEmailToken } from "#/server/verification.server";

function redirectTo(request: Request, search: string): Response {
	return Response.redirect(new URL(`/sign-in?${search}`, request.url), 302);
}

export const Route = createFileRoute("/api/auth/verify-email")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				const token = new URL(request.url).searchParams.get("token");
				if (!token) {
					return redirectTo(request, "verify=invalid");
				}
				try {
					const result = await verifyEmailToken(token);
					return redirectTo(request, `verify=${result}`);
				} catch (error) {
					console.error("Email verification failed", error);
					return redirectTo(request, "verify=error");
				}
			},
		},
	},
});
