import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateUserDto {
	@ApiProperty({
		name: "email",
		type: "string",
		description: "This is email of new user",
		example: "email@example.com",
		required: true,
		uniqueItems: true
	})
	@IsNotEmpty({ message: "Email must be provided!" })
	@IsEmail({}, { message: "Email must be a valid email address!" })
	@Transform(({ value }) => value.trim().toLowerCase())
	email: string

	@ApiProperty({
		name: "marketingData",
		type: "string",
		description: "This is marketingData of new user",
		example: "some marketing data",
		required: false
	})
	@IsOptional()
	@IsString({ message: "Marketing data must be a string!" })
	@Transform(({ value }) => value.trim())
	marketingData?: string
}
