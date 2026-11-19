import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "#/components/ui/button";
import {
	type FieldErrors,
	registerSchema,
	toFieldErrors,
} from "#/lib/validations/auth";
import FormField from "./FormField";

interface RegisterResponse {
	success: boolean;
	error?: string;
	verificationRequired?: boolean;
}

interface RegisterValues {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
}

async function registerUser(
	values: RegisterValues,
): Promise<RegisterResponse> {
	const response = await fetch("/api/auth/register", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(values),
	});
	const data = (await response.json()) as RegisterResponse;
	if (!response.ok || !data.success) {
		throw new Error(data.error ?? "Something went wrong");
	}
	return data;
}

export default function RegisterForm() {
	const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
	const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

	const navigate = useNavigate();

	const mutation = useMutation({
		mutationFn: registerUser,
		onSuccess: (data, values) => {
			if (data.verificationRequired === false) {
				toast.success("Account created. You can sign in now.");
				void navigate({ to: "/sign-in", search: {} });
				return;
			}
			setRegisteredEmail(values.email);
		},
		onError: (error) => toast.error(error.message),
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

	if (registeredEmail) {
		return (
			<div className="space-y-4 text-center">
				<p className="text-sm">
					We sent a verification link to {registeredEmail}. Click it to activate
					your account.
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
