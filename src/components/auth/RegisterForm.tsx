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
}

interface RegisterValues {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
}

async function registerUser(values: RegisterValues): Promise<void> {
	const response = await fetch("/api/auth/register", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(values),
	});
	const data = (await response.json()) as RegisterResponse;
	if (!response.ok || !data.success) {
		throw new Error(data.error ?? "Something went wrong");
	}
}

export default function RegisterForm() {
	const navigate = useNavigate();
	const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

	const mutation = useMutation({
		mutationFn: registerUser,
		onSuccess: () => {
			toast.success("Account created. You can sign in now.");
			return navigate({ to: "/sign-in", search: {} });
		},
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
