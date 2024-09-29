import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator"

export class CreateOfferDto {
	@ApiProperty({
		name: "name",
		type: "string",
		description: "This is name of new offer",
		example: "Offer Name",
		required: true,
		uniqueItems: true
	})
	@IsNotEmpty({ message: "Name of order must be provided!" })
	@IsString({ message: "Wrong format!" })
	@Transform(({ value }) => value.trim())
	name: string

	@ApiProperty({
		name: "price",
		type: "number",
		description: "This is price of new offer",
		example: 1.99,
		required: true
	})
	@IsNotEmpty({ message: "Price must be provided!" })
	@IsNumber({}, { message: "Price must be a number!" })
	@Min(0, { message: "Price must be greater than 0!" })
	@Transform(({ value }) => parseFloat(value))
	price: number
}
