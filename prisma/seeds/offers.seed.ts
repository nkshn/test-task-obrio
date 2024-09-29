import { PrismaClient } from "@prisma/client"

export default async function seedOffers(prisma: PrismaClient) {
	console.log("Seeding offers...")

	await prisma.offer.createMany({
		data: [
			{ name: "Offer 1", price: 19.99 },
			{ name: "Offer 2", price: 29.99 }
		]
	})
}
