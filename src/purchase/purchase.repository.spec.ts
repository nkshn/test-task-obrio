import { Test, TestingModule } from "@nestjs/testing"

import { PrismaService } from "../prisma/prisma.service"

import { PurchaseRepository } from "./purchase.repository"

describe("PurchaseRepository", () => {
	let repository: PurchaseRepository
	let prisma: PrismaService

	const mockPrismaService = {
		purchase: {
			create: jest.fn(),
			findMany: jest.fn()
		}
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				PurchaseRepository,
				{ provide: PrismaService, useValue: mockPrismaService }
			]
		}).compile()

		repository = module.get<PurchaseRepository>(PurchaseRepository)
		prisma = module.get<PrismaService>(PrismaService)
	})

	it("should create a new purchase", async () => {
		const purchase = { id: 1, userId: 1, offerId: 1 }
		mockPrismaService.purchase.create.mockResolvedValue(purchase)

		const result = await repository.createPurchase(1, 1)
		expect(result).toEqual(purchase)
		expect(prisma.purchase.create).toHaveBeenCalledWith({
			data: { userId: 1, offerId: 1 }
		})
	})

	it("should return all purchases with user and offer details", async () => {
		const purchases = [
			{
				id: 1,
				user: {
					id: 3,
					email: "john@example.com",
					marketingData: "some data",
					createdAt: "2024-09-29T19:34:37.838Z",
					updatedAt: "2024-09-29T19:34:37.838Z",
					deletedAt: null
				},
				offer: {
					id: 1,
					name: "Offer 1",
					price: 19.99,
					createdAt: "2024-09-29T19:34:37.843Z",
					updatedAt: "2024-09-29T19:34:37.843Z",
					deletedAt: null
				},
				createdAt: "2024-09-29T19:34:37.853Z",
				updatedAt: "2024-09-29T19:34:37.853Z",
				deletedAt: null
			}
		]

		mockPrismaService.purchase.findMany.mockResolvedValue(purchases)

		const result = await repository.findAllPurchases()
		expect(result).toEqual(purchases)
		expect(prisma.purchase.findMany).toHaveBeenCalledWith({
			include: { offer: true, user: true }
		})
	})
})
