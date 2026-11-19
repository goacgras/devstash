import { createFileRoute } from "@tanstack/react-router";
import bcrypt from "bcryptjs";
import { prisma } from "#/db";
import { registerSchema } from "#/lib/validations/auth";
import { isEmailVerificationEnabled } from "#/server/email-verification.server";
import { sendVerification } from "#/server/verification.server";

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
					const verificationRequired = isEmailVerificationEnabled();
					const user = await prisma.user.create({
						data: {
							name,
							email,
							password: hashedPassword,
							emailVerified: verificationRequired ? null : new Date(),
						},
						select: { id: true, name: true, email: true },
					});

					if (!verificationRequired) {
						return jsonResponse(
							{ success: true, data: user, verificationRequired },
							201,
						);
					}

					try {
						await sendVerification(email, new URL(request.url).origin);
					} catch (error) {
						console.error("Sending verification email failed", error);
						await prisma.verificationToken.deleteMany({
							where: { identifier: email },
						});
						await prisma.user.delete({ where: { id: user.id } });
						return jsonResponse(
							{
								success: false,
								error:
									"We couldn't send the verification email, so your account wasn't created. Please try again later.",
							},
							502,
						);
					}

					return jsonResponse(
						{ success: true, data: user, verificationRequired },
						201,
					);
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
