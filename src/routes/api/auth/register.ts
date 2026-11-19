import { createFileRoute } from "@tanstack/react-router";
import bcrypt from "bcryptjs";
import { prisma } from "#/db";
import { registerSchema } from "#/lib/validations/auth";

const BCRYPT_ROUNDS = 12;

function jsonResponse(body: unknown, status: number): Response {
	return Response.json(body, { status });
}

function isUniqueConstraintError(error: unknown): boolean {
	return (
		typeof error === "object" &&
		error !== null &&
		"code" in error &&
		error.code === "P2002"
	);
}

export const Route = createFileRoute("/api/auth/register")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				let body: unknown;
				try {
					body = await request.json();
				} catch {
					return jsonResponse(
						{ success: false, error: "Invalid JSON body" },
						400,
					);
				}

				const parsed = registerSchema.safeParse(body);
				if (!parsed.success) {
					const error = parsed.error.issues[0]?.message ?? "Invalid input";
					return jsonResponse({ success: false, error }, 400);
				}

				const { name, email, password } = parsed.data;

				try {
					const existing = await prisma.user.findUnique({
						where: { email },
						select: { id: true },
					});
					if (existing) {
						return jsonResponse(
							{
								success: false,
								error: "An account with this email already exists",
							},
							409,
						);
					}

					const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
					const user = await prisma.user.create({
						data: { name, email, password: hashedPassword },
						select: { id: true, name: true, email: true },
					});

					return jsonResponse({ success: true, data: user }, 201);
				} catch (error) {
					if (isUniqueConstraintError(error)) {
						return jsonResponse(
							{
								success: false,
								error: "An account with this email already exists",
							},
							409,
						);
					}
					console.error("Registration failed", error);
					return jsonResponse(
						{ success: false, error: "Something went wrong" },
						500,
					);
				}
			},
		},
	},
});
