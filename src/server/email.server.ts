import { Resend } from "resend";

const DEFAULT_FROM = "DevStash <onboarding@resend.dev>";

function getResend(): Resend {
	const apiKey = process.env.RESEND_API_KEY;
	if (!apiKey) {
		throw new Error("RESEND_API_KEY is required");
	}
	return new Resend(apiKey);
}

export async function sendVerificationEmail(
	to: string,
	verifyUrl: string,
): Promise<void> {
	const { error } = await getResend().emails.send({
		from: process.env.EMAIL_FROM ?? DEFAULT_FROM,
		to,
		subject: "Verify your DevStash email",
		text: `Welcome to DevStash! Verify your email by opening this link (valid for 24 hours):\n\n${verifyUrl}\n\nIf you didn't create an account, you can ignore this email.`,
		html: `<p>Welcome to DevStash!</p><p><a href="${verifyUrl}">Verify your email</a> (link valid for 24 hours).</p><p>If you didn't create an account, you can ignore this email.</p>`,
	});
	if (error) {
		throw new Error(`Failed to send verification email: ${error.message}`);
	}
}
