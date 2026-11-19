import { useState } from "react";
import { cn } from "#/lib/utils";

interface UserAvatarProps {
	image?: string | null;
	name?: string | null;
	email?: string | null;
	className?: string;
}

export function getInitials(name?: string | null, email?: string | null) {
	const fromName = (name ?? "")
		.split(" ")
		.filter(Boolean)
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
	return fromName || email?.[0]?.toUpperCase() || "?";
}

export default function UserAvatar({
	image,
	name,
	email,
	className,
}: UserAvatarProps) {
	const [hasImageFailed, setHasImageFailed] = useState(false);

	if (image && !hasImageFailed) {
		return (
			<img
				src={image}
				alt={name ?? "User avatar"}
				referrerPolicy="no-referrer"
				onError={() => setHasImageFailed(true)}
				className={cn("size-8 shrink-0 rounded-full object-cover", className)}
			/>
		);
	}

	return (
		<div
			className={cn(
				"flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground",
				className,
			)}
		>
			{getInitials(name, email)}
		</div>
	);
}
