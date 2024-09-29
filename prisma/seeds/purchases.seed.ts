import { PrismaClient } from "@prisma/client"

export default async function seedPurchases(prisma: PrismaClient) {
	console.log("Seeding purchases...")

	// Fetch users and offers to get valid IDs
	const user1 = await prisma.user.findFirst({
		where: { email: "john@example.com" }
	})
	const user2 = await prisma.user.findFirst({
		where: { email: "jane@example.com" }
	})

	const offer1 = await prisma.offer.findFirst({ where: { name: "Offer 1" } })
	const offer2 = await prisma.offer.findFirst({ where: { name: "Offer 2" } })

	if (user1 && user2 && offer1 && offer2) {
		await prisma.purchase.createMany({
			data: [
				{ userId: user1.id, offerId: offer1.id },
				{ userId: user2.id, offerId: offer2.id }
			]
		})
	} else {
		console.error("Error: Some users or offers not found for purchase seeding.")
	}
}
