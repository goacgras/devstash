import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";

interface FormFieldProps {
	name: string;
	label: string;
	type?: string;
	autoComplete?: string;
	error?: string;
}

export default function FormField({
	name,
	label,
	type = "text",
	autoComplete,
	error,
}: FormFieldProps) {
	return (
		<div className="space-y-1.5">
			<Label htmlFor={name}>{label}</Label>
			<Input
				id={name}
				name={name}
				type={type}
				autoComplete={autoComplete}
				aria-invalid={error ? true : undefined}
			/>
			{error ? <p className="text-xs text-destructive">{error}</p> : null}
		</div>
	);
}
