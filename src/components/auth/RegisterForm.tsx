import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { Button } from "#/components/ui/button";
import {
	type FieldErrors,
	registerSchema,
	toFieldErrors,
} from "#/lib/validations/auth";
import FormField from "./FormField";

interface RegisterResponse {
	success: boolean;
	emailSent?: boolean;
	error?: string;
}

interface RegisterValues {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
}

async function registerUser(values: RegisterValues): Promise<boolean> {
	const response = await fetch("/api/auth/register", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(values),
	});
	const data = (await response.json()) as RegisterResponse;
	if (!response.ok || !data.success) {
		throw new Error(data.error ?? "Something went wrong");
	}
	return data.emailSent !== false;
}

export default function RegisterForm() {
	const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
	const [registered, setRegistered] = useState<{
		email: string;
		emailSent: boolean;
	} | null>(null);

	const mutation = useMutation({
		mutationFn: registerUser,
		onSuccess: (emailSent, values) =>
			setRegistered({ email: values.email, emailSent }),
	});

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const values: RegisterValues = {
			name: String(formData.get("name") ?? ""),
			email: String(formData.get("email") ?? ""),
			password: String(formData.get("password") ?? ""),
			confirmPassword: String(formData.get("confirmPassword") ?? ""),
		};
		const parsed = registerSchema.safeParse(values);
		if (!parsed.success) {
			setFieldErrors(toFieldErrors(parsed.error));
			return;
		}
		setFieldErrors({});
		mutation.mutate(values);
	};

	if (registered) {
		return (
			<div className="space-y-4 text-center">
				<p className="text-sm">
					{registered.emailSent
						? `We sent a verification link to ${registered.email}. Click it to activate your account.`
						: "Your account was created, but we couldn't send the verification email. Sign in to request a new one."}
				</p>
				<Link to="/sign-in" search={{}} className="text-sm underline">
					Go to sign in
				</Link>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<form onSubmit={handleSubmit} className="space-y-4" noValidate>
				<FormField
					name="name"
					label="Name"
					autoComplete="name"
					error={fieldErrors.name}
				/>
				<FormField
					name="email"
					label="Email"
					type="email"
					autoComplete="email"
					error={fieldErrors.email}
				/>
				<FormField
					name="password"
					label="Password"
					type="password"
					autoComplete="new-password"
					error={fieldErrors.password}
				/>
				<FormField
					name="confirmPassword"
					label="Confirm password"
					type="password"
					autoComplete="new-password"
					error={fieldErrors.confirmPassword}
				/>
				{mutation.error ? (
					<p role="alert" className="text-sm text-destructive">
						{mutation.error.message}
					</p>
				) : null}
				<Button type="submit" className="w-full" disabled={mutation.isPending}>
					{mutation.isPending ? "Creating account..." : "Create account"}
				</Button>
			</form>
			<p className="text-center text-sm text-muted-foreground">
				Already have an account?{" "}
				<Link to="/sign-in" search={{}} className="text-foreground underline">
					Sign in
				</Link>
			</p>
		</div>
	);
}
