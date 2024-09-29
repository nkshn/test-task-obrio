import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsInt, IsNotEmpty } from "class-validator"

export class CreatePurchaseDto {
	@ApiProperty({
		name: "userId",
		type: "number",
		description: "This is userId of new purchase associated with this purchase",
		example: 1,
		required: true
	})
	@IsNotEmpty({ message: "User must be provided!" })
	@IsInt({ message: "User in wrong format!" })
	@Transform(({ value }) => parseInt(value, 10))
	userId: number

	@ApiProperty({
		name: "offerId",
		type: "number",
		description:
			"This is offerId of new purchase associated with this purchase",
		example: 1,
		required: true
	})
	@IsNotEmpty({ message: "Offer must be provided!" })
	@IsInt({ message: "Offer in wrong format!" })
	@Transform(({ value }) => parseInt(value, 10))
	offerId: number
}
