// Deletes every user except the demo user, plus their content (items, collections,
// tags, custom types, accounts and sessions go via cascade deletes).
//
// Dry run by default. Pass --yes to actually delete.
//   npm run db:delete-users           # preview
//   npm run db:delete-users -- --yes  # delete
import { PrismaPg } from "@prisma/adapter-pg";

import { getDatabaseUrl } from "../src/database-url.js";
import { PrismaClient } from "../src/generated/prisma/client.js";

const KEEP_EMAIL = "demo@devstash.io";

async function main() {
	const databaseUrl = getDatabaseUrl();
	const confirmed = process.argv.includes("--yes");
	const prisma = new PrismaClient({
		adapter: new PrismaPg({ connectionString: databaseUrl }),
	});

	try {
		console.log(`Database host: ${new URL(databaseUrl).host}`);

		const keeper = await prisma.user.findUnique({
			where: { email: KEEP_EMAIL },
			select: { id: true },
		});
		if (!keeper) {
			throw new Error(`${KEEP_EMAIL} not found; refusing to delete everyone`);
		}

		const where = { id: { not: keeper.id } };
		const users = await prisma.user.findMany({
			where,
			select: { email: true, _count: { select: { items: true, collections: true } } },
		});

		console.log(`Users to delete: ${users.length}`);
		for (const user of users) {
			console.log(
				`  ${user.email ?? "(no email)"} - ${user._count.items} items, ${user._count.collections} collections`,
			);
		}

		if (!confirmed) {
			console.log("Dry run. Re-run with --yes to delete.");
			return;
		}

		const emails = users.flatMap((user) => (user.email ? [user.email] : []));
		const tokens = await prisma.verificationToken.deleteMany({
			where: { identifier: { in: emails } },
		});
		const result = await prisma.user.deleteMany({ where });
		console.log(
			`Deleted ${result.count} users and ${tokens.count} verification tokens.`,
		);
	} finally {
		await prisma.$disconnect();
	}
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
