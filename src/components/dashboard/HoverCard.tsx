import { motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "#/lib/utils";

interface HoverCardProps {
	// Tailwind left-border color class (e.g. "border-l-blue-500")
	accentClassName?: string;
	className?: string;
	children: ReactNode;
}

const HOVER_TRANSITION = {
	type: "spring",
	stiffness: 400,
	damping: 30,
} as const;

export default function HoverCard({
	accentClassName,
	className,
	children,
}: HoverCardProps) {
	return (
		<motion.li
			whileHover={{
				y: -3,
				boxShadow: "0 12px 24px -12px rgba(0, 0, 0, 0.5)",
			}}
			transition={HOVER_TRANSITION}
			className={cn(
				"flex rounded-xl border border-l-4 border-border bg-card p-4",
				accentClassName,
				className,
			)}
		>
			{children}
		</motion.li>
	);
}
