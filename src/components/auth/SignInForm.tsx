import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "#/components/ui/button";
import {
	AUTH_ERROR_MESSAGES,
	EMAIL_NOT_VERIFIED_CODE,
	resendVerification,
	SignInError,
	signInWithCredentials,
	signInWithGitHub,
	VERIFY_MESSAGES,
} from "#/lib/auth-client";
import {
	type FieldErrors,
	signInSchema,
	toFieldErrors,
} from "#/lib/validations/auth";
import FormField from "./FormField";

interface SignInFormProps {
	redirectTo: string;
	errorCode?: string;
	verifyStatus?: string;
}

export default function SignInForm({
	redirectTo,
	errorCode,
	verifyStatus,
}: SignInFormProps) {
	const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

	const credentialsMutation = useMutation({
		mutationFn: (values: { email: string; password: string }) =>
			signInWithCredentials(values.email, values.password, redirectTo),
	});
	const [email, setEmail] = useState("");
	const resendMutation = useMutation({
		mutationFn: () => resendVerification(email),
		onSuccess: () =>
			toast.success("Verification email sent. Check your inbox."),
		onError: () =>
			toast.error(
				"We couldn't send the verification email. Please try again later.",
			),
	});
	const githubMutation = useMutation({
		mutationFn: () => signInWithGitHub(redirectTo),
	});

	const verifySuccess = verifyStatus === "verified";
	const verifyError =
		verifyStatus && !verifySuccess ? VERIFY_MESSAGES[verifyStatus] : null;
	const needsVerification =
		credentialsMutation.error instanceof SignInError &&
		credentialsMutation.error.code === EMAIL_NOT_VERIFIED_CODE;
	const showResend = needsVerification || verifyStatus === "expired";

	const urlError = errorCode
		? (AUTH_ERROR_MESSAGES[errorCode] ?? "Sign in failed. Please try again.")
		: null;
	const formError =
		credentialsMutation.error?.message ??
		githubMutation.error?.message ??
		urlError ??
		verifyError;
	const isPending = credentialsMutation.isPending || githubMutation.isPending;

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const parsed = signInSchema.safeParse({
			email: formData.get("email"),
			password: formData.get("password"),
		});
		if (!parsed.success) {
			setFieldErrors(toFieldErrors(parsed.error));
			return;
		}
		setFieldErrors({});
		setEmail(parsed.data.email);
		credentialsMutation.mutate(parsed.data);
	};

	return (
		<div className="space-y-4">
			<form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
					autoComplete="current-password"
					error={fieldErrors.password}
				/>
				{verifySuccess ? (
					<p role="status" className="text-sm text-emerald-500">
						Email verified. You can sign in now.
					</p>
				) : null}
				{formError ? (
					<p role="alert" className="text-sm text-destructive">
						{formError}
					</p>
				) : null}
				{showResend ? (
					<Button
						type="button"
						variant="outline"
						className="w-full"
						disabled={!email || resendMutation.isPending}
						onClick={() => resendMutation.mutate()}
					>
						{resendMutation.isPending
							? "Sending..."
							: "Resend verification email"}
					</Button>
				) : null}
				<Button type="submit" className="w-full" disabled={isPending}>
					{credentialsMutation.isPending ? "Signing in..." : "Sign in"}
				</Button>
			</form>
			<div className="flex items-center gap-3 text-xs text-muted-foreground">
				<div className="h-px flex-1 bg-border" />
				or
				<div className="h-px flex-1 bg-border" />
			</div>
			<Button
				type="button"
				variant="outline"
				className="w-full"
				disabled={isPending}
				onClick={() => githubMutation.mutate()}
			>
				Sign in with GitHub
			</Button>
			<p className="text-center text-sm text-muted-foreground">
				Don't have an account?{" "}
				<Link to="/register" className="text-foreground underline">
					Register
				</Link>
			</p>
		</div>
	);
}
