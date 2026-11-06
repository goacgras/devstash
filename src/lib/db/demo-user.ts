import { prisma } from "#/db";

// Auth is not wired up yet, so the dashboard shows the seeded demo user's data.
const DEMO_USER_EMAIL = "demo@devstash.io";

export async function getDemoUserId(): Promise<string | null> {
	const user = await prisma.user.findUnique({
		where: { email: DEMO_USER_EMAIL },
		select: { id: true },
	});
	return user?.id ?? null;
}
