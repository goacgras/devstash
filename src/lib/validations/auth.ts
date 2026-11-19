import { z } from "zod";

export const registerSchema = z
	.object({
		name: z.string().trim().min(1, "Name is required"),
		email: z
			.email("Invalid email address")
			.transform((value) => value.toLowerCase()),
		password: z.string().min(8, "Password must be at least 8 characters"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export const signInSchema = z.object({
	email: z.email("Invalid email address"),
	password: z.string().min(1, "Password is required"),
});

export const DEFAULT_REDIRECT = "/dashboard";

// Only same-origin relative paths are allowed, to avoid open redirects.
export const redirectSchema = z
	.string()
	.refine(
		(value) =>
			value.startsWith("/") &&
			!value.startsWith("//") &&
			!value.startsWith("/\\"),
	)
	.optional()
	.catch(undefined);

export type FieldErrors = Partial<Record<string, string>>;

export function toFieldErrors(error: z.ZodError): FieldErrors {
	const errors: FieldErrors = {};
	for (const issue of error.issues) {
		const key = String(issue.path[0] ?? "form");
		if (!errors[key]) {
			errors[key] = issue.message;
		}
	}
	return errors;
}
