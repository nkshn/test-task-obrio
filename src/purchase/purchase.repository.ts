import { Injectable } from "@nestjs/common"

import { PrismaService } from "../prisma/prisma.service"

@Injectable()
export class PurchaseRepository {
	constructor(private readonly prisma: PrismaService) {}

	async createPurchase(userId: number, offerId: number) {
		return this.prisma.purchase.create({
			data: {
				userId: userId,
				offerId: offerId
			}
		})
	}

	async findAllPurchases() {
		return this.prisma.purchase.findMany({
			include: {
				offer: true,
				user: true
			}
		})
	}
}
