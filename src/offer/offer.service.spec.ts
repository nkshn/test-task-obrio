import { BadRequestException } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"

import { OfferRepository } from "./offer.repository"
import { OfferService } from "./offer.service"

describe("OfferService", () => {
	let service: OfferService

	const mockOfferRepository = {
		findByName: jest.fn(),
		createOffer: jest.fn(),
		findAllOffers: jest.fn()
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				OfferService,
				{ provide: OfferRepository, useValue: mockOfferRepository }
			]
		}).compile()

		service = module.get<OfferService>(OfferService)
	})

	it("should be defined", () => {
		expect(service).toBeDefined()
	})

	it("should create an offer successfully", async () => {
		mockOfferRepository.findByName.mockResolvedValue(null)
		mockOfferRepository.createOffer.mockResolvedValue({
			id: 1,
			name: "Special Offer",
			price: 100
		})

		const result = await service.createOffer({
			name: "Special Offer",
			price: 100
		})

		expect(result).toEqual({
			id: 1,
			name: "Special Offer",
			price: 100
		})
		expect(mockOfferRepository.createOffer).toHaveBeenCalledWith(
			"Special Offer",
			100
		)
	})

	it("should throw an error if offer with the same name exists", async () => {
		mockOfferRepository.findByName.mockResolvedValue({
			id: 1,
			name: "Duplicate Offer"
		})

		await expect(
			service.createOffer({
				name: "Duplicate Offer",
				price: 150
			})
		).rejects.toThrow(BadRequestException)
	})

	it("should return all offers", async () => {
		const offers = [
			{ id: 1, name: "Offer 1", price: 100 },
			{ id: 2, name: "Offer 2", price: 200 }
		]
		mockOfferRepository.findAllOffers.mockResolvedValue(offers)

		const result = await service.getAllOffers()
		expect(result).toEqual(offers)
		expect(mockOfferRepository.findAllOffers).toHaveBeenCalled()
	})
})
