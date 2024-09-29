import { PrismaClient } from "@prisma/client"

export default async function clearDatabase(prisma: PrismaClient) {
	console.log("Clearing database...")

	await prisma.purchase.deleteMany({})
	await prisma.user.deleteMany({})
	await prisma.offer.deleteMany({})

	console.log("Database cleared!")
}
