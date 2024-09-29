import { Test, TestingModule } from "@nestjs/testing"

import { PrismaService } from "../prisma/prisma.service"

import { OfferRepository } from "./offer.repository"

describe("OfferRepository", () => {
	let repository: OfferRepository
	let prisma: PrismaService

	const mockPrismaService = {
		offer: {
			findUnique: jest.fn(),
			findFirst: jest.fn(),
			findMany: jest.fn(),
			create: jest.fn()
		}
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				OfferRepository,
				{ provide: PrismaService, useValue: mockPrismaService }
			]
		}).compile()

		repository = module.get<OfferRepository>(OfferRepository)
		prisma = module.get<PrismaService>(PrismaService)
	})

	it("should be defined", () => {
		expect(repository).toBeDefined()
	})

	it("should return an offer by ID", async () => {
		const offer = { id: 1, name: "Offer 1", price: 100 }
		mockPrismaService.offer.findUnique.mockResolvedValue(offer)

		const result = await repository.findById(1)
		expect(result).toEqual(offer)
		expect(prisma.offer.findUnique).toHaveBeenCalledWith({ where: { id: 1 } })
	})

	it("should return an offer by name", async () => {
		const offer = { id: 1, name: "Offer 1", price: 100 }
		mockPrismaService.offer.findFirst.mockResolvedValue(offer)

		const result = await repository.findByName("Offer 1")
		expect(result).toEqual(offer)
		expect(prisma.offer.findFirst).toHaveBeenCalledWith({
			where: { name: "Offer 1" }
		})
	})

	it("should create a new offer", async () => {
		const offer = { id: 1, name: "New Offer", price: 50 }
		mockPrismaService.offer.create.mockResolvedValue(offer)

		const result = await repository.createOffer("New Offer", 50)
		expect(result).toEqual(offer)
		expect(prisma.offer.create).toHaveBeenCalledWith({
			data: { name: "New Offer", price: 50 }
		})
	})
})
