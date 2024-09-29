import { Body, Controller, Get, Post } from "@nestjs/common"
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"

import { CreatePurchaseDto } from "./dto/create-purchase.dto"
import { PurchaseService } from "./purchase.service"

@ApiTags("Purchase")
@Controller("purchase")
export class PurchaseController {
	constructor(private readonly purchaseService: PurchaseService) {}

	@Get()
	@ApiOperation({ summary: "Get all purchases" })
	@ApiResponse({
		status: 200,
		description: "List of all purchases",
		example: [
			{
				id: 1,
				user: {
					id: 1,
					email: "john@example.com",
					marketingData: "some data",
					createdAt: "2024-09-29T19:34:37.838Z",
					updatedAt: "2024-09-29T19:34:37.838Z",
					deletedAt: null
				},
				offer: {
					id: 1,
					name: "Special Offer",
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
	})
	async getAllPurchases() {
		return this.purchaseService.getAllPurchases()
	}

	@Post()
	@ApiOperation({
		summary:
			"Create a new purchase and send external API call and after 24h will send other API call"
	})
	@ApiBody({
		type: CreatePurchaseDto,
		description: "JSON structure for creating a new purchase"
	})
	@ApiResponse({
		status: 201,
		description: "Purchase successfully created",
		example: {
			id: 1,
			userId: 1,
			offerId: 1,
			createdAt: "2024-09-29T21:46:41.806Z",
			updatedAt: "2024-09-29T21:46:41.806Z",
			deletedAt: null
		}
	})
	@ApiResponse({
		status: 400,
		description: "Bad Request: Invalid input data",
		example: {
			message: [
				{
					type: "userId",
					message: "User with this ID does not exist"
				}
			],
			error: "Bad Request",
			statusCode: 400
		}
	})
	async createPurchase(@Body() createPurchaseDto: CreatePurchaseDto) {
		return this.purchaseService.createPurchase(createPurchaseDto)
	}
}
