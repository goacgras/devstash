// Client-safe helpers that call the Auth.js HTTP endpoints (no next-auth in this project).

interface CsrfResponse {
	csrfToken: string;
}

interface CredentialsResponse {
	url?: string;
}

export const AUTH_ERROR_MESSAGES: Record<string, string> = {
	CredentialsSignin: "Invalid email or password",
	OAuthAccountNotLinked:
		"This email is already registered with a different sign-in method",
};

export const EMAIL_NOT_VERIFIED_CODE = "EmailNotVerified";

export const VERIFY_MESSAGES: Record<string, string> = {
	expired: "This verification link has expired. Request a new one below.",
	invalid: "This verification link is invalid or was already used.",
	error: "We couldn't verify your email. Please try again.",
};

export class SignInError extends Error {
	code: string | null;

	constructor(message: string, code: string | null) {
		super(message);
		this.code = code;
	}
}

export const DEFAULT_AUTH_ERROR = "Something went wrong. Please try again.";

async function getCsrfToken(): Promise<string> {
	const response = await fetch("/api/auth/csrf");
	if (!response.ok) {
		throw new Error(DEFAULT_AUTH_ERROR);
	}
	const data = (await response.json()) as CsrfResponse;
	return data.csrfToken;
}

// A real form post lets the browser follow Auth.js redirects (GitHub, sign out).
function submitForm(action: string, fields: Record<string, string>): void {
	const form = document.createElement("form");
	form.method = "POST";
	form.action = action;
	for (const [name, value] of Object.entries(fields)) {
		const input = document.createElement("input");
		input.type = "hidden";
		input.name = name;
		input.value = value;
		form.appendChild(input);
	}
	document.body.appendChild(form);
	form.submit();
}

export async function signInWithCredentials(
	email: string,
	password: string,
	callbackUrl: string,
): Promise<void> {
	const csrfToken = await getCsrfToken();
	const response = await fetch("/api/auth/callback/credentials", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			"X-Auth-Return-Redirect": "1",
		},
		body: new URLSearchParams({
			csrfToken,
			email,
			password,
			callbackUrl,
		}),
	});
	const data = (await response.json()) as CredentialsResponse;
	const params = data.url
		? new URL(data.url, window.location.origin).searchParams
		: null;
	const errorCode = params?.get("error") ?? null;
	if (errorCode || !response.ok) {
		if (params?.get("code") === EMAIL_NOT_VERIFIED_CODE) {
			throw new SignInError(
				"Please verify your email before signing in",
				EMAIL_NOT_VERIFIED_CODE,
			);
		}
		throw new SignInError(
			(errorCode && AUTH_ERROR_MESSAGES[errorCode]) || DEFAULT_AUTH_ERROR,
			errorCode,
		);
	}
	window.location.assign(callbackUrl);
}

export async function signInWithGitHub(callbackUrl: string): Promise<void> {
	const csrfToken = await getCsrfToken();
	submitForm("/api/auth/signin/github", { csrfToken, callbackUrl });
}

export async function signOut(): Promise<void> {
	const csrfToken = await getCsrfToken();
	submitForm("/api/auth/signout", { csrfToken, callbackUrl: "/sign-in" });
}

export async function resendVerification(email: string): Promise<void> {
	const response = await fetch("/api/auth/resend-verification", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email }),
	});
	if (!response.ok) {
		throw new Error(DEFAULT_AUTH_ERROR);
	}
}
