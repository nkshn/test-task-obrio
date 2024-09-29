import { PrismaClient } from "@prisma/client"

export default async function seedUsers(prisma: PrismaClient) {
	console.log("Seeding users...")

	await prisma.user.createMany({
		data: [
			{ email: "john@example.com", marketingData: "some data" },
			{ email: "jane@example.com", marketingData: "some cool data" }
		]
	})
}
