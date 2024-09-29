import { BadRequestException, Injectable, Logger } from "@nestjs/common"

import { HttpRequestService } from "../http-request/http-request.service"
import { OfferRepository } from "../offer/offer.repository"
import { QueueService } from "../queue/queue.service"
import { UserRepository } from "../user/user.repository"

import { CreatePurchaseDto } from "./dto/create-purchase.dto"
import { PurchaseRepository } from "./purchase.repository"

@Injectable()
export class PurchaseService {
	private readonly logger = new Logger(PurchaseService.name)

	constructor(
		private readonly userRepository: UserRepository,
		private readonly offerRepository: OfferRepository,
		private readonly purchaseRepository: PurchaseRepository,
		private readonly queueService: QueueService,
		private readonly httpRequestService: HttpRequestService
	) {}

	async createPurchase(dto: CreatePurchaseDto) {
		const { userId, offerId } = dto

		this.logger.log(
			`Creating purchase for user ID: ${userId}, offer ID: ${offerId}`
		)

		const userExists = await this.userRepository.findById(userId)
		if (!userExists) {
			this.logger.warn(`User with ID: ${userId} does not exist`)
			throw new BadRequestException(`Such user does not exist`)
		}

		const offerExists = await this.offerRepository.findById(offerId)
		if (!offerExists) {
			this.logger.warn(`Offer with ID: ${offerId} does not exist`)
			throw new BadRequestException(`Such offer does not exist`)
		}

		const purchase = await this.purchaseRepository.createPurchase(
			userId,
			offerId
		)

		// make a fake request to the external service
		await this.httpRequestService.sendFakeRequest()

		// add a job to the queue to send an astrology report in 24 hours
		await this.queueService.addAstrologyReportJob({ userId })

		this.logger.log(
			`Purchase created and astrology report scheduled for Purchase ID: ${purchase.id}`
		)
		return purchase
	}

	async getAllPurchases() {
		this.logger.log("Fetching all purchases")

		const purchases = await this.purchaseRepository.findAllPurchases()

		const formattedPurchases = purchases.map(purchase => ({
			id: purchase.id,
			user: purchase.user,
			offer: purchase.offer,
			createdAt: purchase.createdAt,
			updatedAt: purchase.updatedAt,
			deletedAt: purchase.deletedAt
		}))

		return formattedPurchases
	}
}
