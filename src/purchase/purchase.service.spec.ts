import { BadRequestException } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"

import { HttpRequestService } from "../http-request/http-request.service"
import { OfferRepository } from "../offer/offer.repository"
import { QueueService } from "../queue/queue.service"
import { UserRepository } from "../user/user.repository"

import { PurchaseRepository } from "./purchase.repository"
import { PurchaseService } from "./purchase.service"

describe("PurchaseService", () => {
	let service: PurchaseService
	let queueService: QueueService
	let httpRequestService: HttpRequestService

	const mockQueueService = {
		addAstrologyReportJob: jest.fn()
	}

	const mockHttpRequestService = {
		sendFakeRequest: jest.fn()
	}

	const mockPurchaseRepository = {
		createPurchase: jest.fn(),
		findAllPurchases: jest.fn()
	}

	const mockUserRepository = {
		findById: jest.fn()
	}

	const mockOfferRepository = {
		findById: jest.fn()
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				PurchaseService,
				{ provide: PurchaseRepository, useValue: mockPurchaseRepository },
				{ provide: UserRepository, useValue: mockUserRepository },
				{ provide: OfferRepository, useValue: mockOfferRepository },
				{ provide: QueueService, useValue: mockQueueService },
				{ provide: HttpRequestService, useValue: mockHttpRequestService }
			]
		}).compile()

		service = module.get<PurchaseService>(PurchaseService)
		queueService = module.get<QueueService>(QueueService)
		httpRequestService = module.get<HttpRequestService>(HttpRequestService)
	})

	it("should be defined", () => {
		expect(service).toBeDefined()
	})

	it("should create a purchase successfully", async () => {
		mockUserRepository.findById.mockResolvedValue({
			id: 1,
			email: "test@example.com"
		})
		mockOfferRepository.findById.mockResolvedValue({
			id: 1,
			name: "Special Offer"
		})
		mockPurchaseRepository.createPurchase.mockResolvedValue({
			id: 1,
			userId: 1,
			offerId: 1
		})

		const result = await service.createPurchase({ userId: 1, offerId: 1 })

		expect(result).toEqual({
			id: 1,
			userId: 1,
			offerId: 1
		})

		expect(queueService.addAstrologyReportJob).toHaveBeenCalledWith({
			userId: 1
		})
		expect(httpRequestService.sendFakeRequest).toHaveBeenCalled()
	})

	it("should throw an error if the user does not exist", async () => {
		mockUserRepository.findById.mockResolvedValue(null)

		await expect(
			service.createPurchase({ userId: 1, offerId: 1 })
		).rejects.toThrow(BadRequestException)
	})

	it("should throw an error if the offer does not exist", async () => {
		mockUserRepository.findById.mockResolvedValue({
			id: 1,
			email: "test@example.com"
		})
		mockOfferRepository.findById.mockResolvedValue(null)

		await expect(
			service.createPurchase({ userId: 1, offerId: 1 })
		).rejects.toThrow(BadRequestException)
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
		mockPurchaseRepository.findAllPurchases.mockResolvedValue(purchases)

		const result = await service.getAllPurchases()

		expect(result).toEqual(purchases)
		expect(mockPurchaseRepository.findAllPurchases).toHaveBeenCalled()
	})
})
