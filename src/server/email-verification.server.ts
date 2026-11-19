const DISABLED_VALUES = new Set(["false", "0"]);

export function isEmailVerificationEnabled(): boolean {
	const value = process.env.EMAIL_VERIFICATION_ENABLED?.trim().toLowerCase();
	return !(value && DISABLED_VALUES.has(value));
}
