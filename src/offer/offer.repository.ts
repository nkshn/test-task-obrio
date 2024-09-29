import { Injectable } from "@nestjs/common"

import { PrismaService } from "../prisma/prisma.service"

@Injectable()
export class OfferRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findById(offerId: number) {
		return this.prisma.offer.findUnique({
			where: { id: offerId }
		})
	}

	async findByName(name: string) {
		return this.prisma.offer.findFirst({
			where: { name }
		})
	}

	async findAllOffers() {
		return this.prisma.offer.findMany()
	}

	async createOffer(name: string, price: number) {
		return this.prisma.offer.create({
			data: { name, price }
		})
	}
}
