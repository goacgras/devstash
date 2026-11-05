import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/items/$type")({
	component: ItemsByType,
});

function ItemsByType() {
	const { type } = Route.useParams();

	return (
		<main className="p-6">
			<h1 className="text-2xl font-semibold capitalize">{type}</h1>
		</main>
	);
}
