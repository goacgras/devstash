import { createHash, randomBytes } from "node:crypto";
import { prisma } from "#/db";
import { sendVerificationEmail } from "./email.server";

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

function hashToken(token: string): string {
	return createHash("sha256").update(token).digest("hex");
}

export async function sendVerification(
	email: string,
	origin: string,
): Promise<void> {
	const token = randomBytes(32).toString("hex");
	await prisma.verificationToken.deleteMany({ where: { identifier: email } });
	await prisma.verificationToken.create({
		data: {
			identifier: email,
			token: hashToken(token),
			expires: new Date(Date.now() + TOKEN_TTL_MS),
		},
	});
	const verifyUrl = `${origin}/api/auth/verify-email?token=${token}`;
	await sendVerificationEmail(email, verifyUrl);
}

export type VerifyResult = "verified" | "expired" | "invalid";

export async function verifyEmailToken(token: string): Promise<VerifyResult> {
	const record = await prisma.verificationToken.findUnique({
		where: { token: hashToken(token) },
	});
	if (!record) {
		return "invalid";
	}
	await prisma.verificationToken.delete({ where: { token: record.token } });
	if (record.expires < new Date()) {
		return "expired";
	}
	await prisma.user.updateMany({
		where: { email: record.identifier },
		data: { emailVerified: new Date() },
	});
	return "verified";
}
