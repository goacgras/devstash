import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/collections")({
	component: Collections,
});

function Collections() {
	return (
		<main className="p-6">
			<h1 className="text-2xl font-semibold">Collections</h1>
		</main>
	);
}
