import { Body, Controller, Get, Post } from "@nestjs/common"
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"

import { CreateOfferDto } from "./dto/create-offer.dto"
import { OfferService } from "./offer.service"

@ApiTags("Offer")
@Controller("offer")
export class OfferController {
	constructor(private readonly offerService: OfferService) {}

	@Get()
	@ApiOperation({ summary: "Get all offers" })
	@ApiResponse({
		status: 200,
		description: "List of all offers",
		example: [
			{
				id: 1,
				name: "Offer 1",
				price: 100.5,
				createdAt: "2024-09-29T19:34:37.838Z",
				updatedAt: "2024-09-29T19:34:37.838Z",
				deletedAt: null
			},
			{
				id: 2,
				name: "Offer 2",
				price: 49.99,
				createdAt: "2024-09-29T19:34:37.838Z",
				updatedAt: "2024-09-29T19:34:37.838Z",
				deletedAt: null
			}
		]
	})
	async getAllOffers() {
		return this.offerService.getAllOffers()
	}

	@Post()
	@ApiOperation({ summary: "Create a new offer" })
	@ApiBody({
		type: CreateOfferDto,
		description: "JSON structure for creating a new offer"
	})
	@ApiResponse({
		status: 201,
		description: "Offer successfully created",
		example: {
			id: 1,
			name: "New Offer",
			price: 150.0,
			createdAt: "2024-09-29T19:46:41.806Z",
			updatedAt: "2024-09-29T19:46:41.806Z",
			deletedAt: null
		}
	})
	@ApiResponse({
		status: 400,
		description: "Bad Request: Invalid input data",
		example: {
			message: [
				{
					type: "price",
					message: "Price must be a number"
				}
			],
			error: "Bad Request",
			statusCode: 400
		}
	})
	async createOffer(@Body() createOfferDto: CreateOfferDto) {
		return this.offerService.createOffer(createOfferDto)
	}
}
