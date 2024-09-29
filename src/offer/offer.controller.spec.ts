import { Test, TestingModule } from "@nestjs/testing"

import { OfferController } from "./offer.controller"
import { OfferService } from "./offer.service"

describe("OfferController", () => {
	let controller: OfferController

	const mockOfferService = {
		getAllOffers: jest.fn(),
		createOffer: jest.fn()
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [OfferController],
			providers: [{ provide: OfferService, useValue: mockOfferService }]
		}).compile()

		controller = module.get<OfferController>(OfferController)
	})

	it("should be defined", () => {
		expect(controller).toBeDefined()
	})

	it("should return all offers", async () => {
		const offers = [{ id: 1, name: "Offer 1", price: 100 }]
		mockOfferService.getAllOffers.mockResolvedValue(offers)

		const result = await controller.getAllOffers()
		expect(result).toEqual(offers)
		expect(mockOfferService.getAllOffers).toHaveBeenCalled()
	})

	it("should create an offer", async () => {
		const createOfferDto = { name: "New Offer", price: 50 }
		const offer = { id: 1, name: "New Offer", price: 50 }

		mockOfferService.createOffer.mockResolvedValue(offer)

		const result = await controller.createOffer(createOfferDto)
		expect(result).toEqual(offer)
		expect(mockOfferService.createOffer).toHaveBeenCalledWith(createOfferDto)
	})
})
