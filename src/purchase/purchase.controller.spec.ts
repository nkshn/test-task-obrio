import { Test, TestingModule } from "@nestjs/testing"

import { PurchaseController } from "./purchase.controller"
import { PurchaseService } from "./purchase.service"

describe("PurchaseController", () => {
	let controller: PurchaseController
	let service: PurchaseService

	const mockPurchaseService = {
		createPurchase: jest.fn(),
		getAllPurchases: jest.fn()
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [PurchaseController],
			providers: [{ provide: PurchaseService, useValue: mockPurchaseService }]
		}).compile()

		controller = module.get<PurchaseController>(PurchaseController)
		service = module.get<PurchaseService>(PurchaseService)
	})

	it("should be defined", () => {
		expect(service).toBeDefined()
	})

	it("should create a purchase", async () => {
		const createPurchaseDto = { userId: 1, offerId: 1 }
		const purchase = { id: 1, userId: 1, offerId: 1 }

		mockPurchaseService.createPurchase.mockResolvedValue(purchase)

		const result = await controller.createPurchase(createPurchaseDto)
		expect(result).toEqual(purchase)
		expect(service.createPurchase).toHaveBeenCalledWith(createPurchaseDto)
	})

	it("should return all purchases", async () => {
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

		mockPurchaseService.getAllPurchases.mockResolvedValue(purchases)

		const result = await controller.getAllPurchases()
		expect(result).toEqual(purchases)
		expect(service.getAllPurchases).toHaveBeenCalled()
	})
})
