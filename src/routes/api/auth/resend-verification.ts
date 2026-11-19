import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { prisma } from "#/db";
import { sendVerification } from "#/server/verification.server";

const bodySchema = z.object({
	email: z.email().transform((value) => value.toLowerCase()),
});

export const Route = createFileRoute("/api/auth/resend-verification")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const parsed = bodySchema.safeParse(
					await request.json().catch(() => null),
				);
				if (!parsed.success) {
					return Response.json(
						{ success: false, error: "Invalid email address" },
						{ status: 400 },
					);
				}
				const { email } = parsed.data;
				try {
					const user = await prisma.user.findUnique({
						where: { email },
						select: { emailVerified: true, password: true },
					});
					// Same response either way so this can't be used to probe for accounts.
					if (user?.password && !user.emailVerified) {
						await sendVerification(email, new URL(request.url).origin);
					}
					return Response.json({ success: true });
				} catch (error) {
					console.error("Resend verification failed", error);
					return Response.json(
						{ success: false, error: "Something went wrong" },
						{ status: 500 },
					);
				}
			},
		},
	},
});
