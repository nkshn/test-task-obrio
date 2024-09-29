import { PrismaClient } from "@prisma/client"

import seedUsers from "./seeds/users.seed"
import seedOffers from "./seeds/offers.seed"
import seedPurchases from "./seeds/purchases.seed"
import clearDatabase from "./seeds/clear-database"

const prisma = new PrismaClient()

async function main() {
	console.log("Seeding database...")

	await clearDatabase(prisma)

	await seedUsers(prisma)
	await seedOffers(prisma)
	await seedPurchases(prisma)

	console.log("Seeding complete!")
}

main()
	.catch(e => {
		console.error("Seeding database error: ", e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
