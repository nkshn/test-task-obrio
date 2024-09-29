import { BadRequestException, Injectable, Logger } from "@nestjs/common"

import { CreateOfferDto } from "./dto/create-offer.dto"
import { OfferRepository } from "./offer.repository"

@Injectable()
export class OfferService {
	private readonly logger = new Logger(OfferService.name)

	constructor(private readonly offerRepository: OfferRepository) {}

	async createOffer(dto: CreateOfferDto) {
		this.logger.log(`Creating offer: ${dto.name}`)

		const { name, price } = dto

		const existingOffer = await this.offerRepository.findByName(name)
		if (existingOffer) {
			this.logger.warn(`Offer with name ${dto.name} already exists`)
			throw new BadRequestException("Offer with this name already exists")
		}

		const offer = await this.offerRepository.createOffer(name, price)
		this.logger.log(`Offer created successfully with ID: ${offer.id}`)
		return offer
	}

	async getAllOffers() {
		this.logger.log("Get all offers")
		return this.offerRepository.findAllOffers()
	}
}
