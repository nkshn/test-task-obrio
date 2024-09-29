import { Body, Controller, Get, Post } from "@nestjs/common"
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"

import { CreateUserDto } from "./dto/create-user.dto"
import { UserService } from "./user.service"

@ApiTags("User")
@Controller("user")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	@ApiOperation({ summary: "Get all users" })
	@ApiResponse({
		status: 200,
		description: "List of all users",
		example: [
			{
				id: 1,
				email: "john@example.com",
				marketingData: "some data",
				createdAt: "2024-09-29T19:34:37.838Z",
				updatedAt: "2024-09-29T19:34:37.838Z",
				deletedAt: null
			},
			{
				id: 2,
				email: "jane@example.com",
				marketingData: "some cool data",
				createdAt: "2024-09-29T19:34:37.838Z",
				updatedAt: "2024-09-29T19:34:37.838Z",
				deletedAt: null
			},
			,
		]
	})
	async getAllUsers() {
		return this.userService.getAllUsers()
	}

	@Post()
	@ApiOperation({ summary: "Create a new user" })
	@ApiBody({
		type: CreateUserDto,
		description: "JSON structure for creating a new user"
	})
	@ApiResponse({
		status: 201,
		description: "User successfully created",
		example: {
			id: 1,
			email: "email@email.com",
			marketingData: "some data",
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
					type: "email",
					message: "Email must be a valid email address!"
				}
			],
			error: "Bad Request",
			statusCode: 400
		}
	})
	async createUser(@Body() createUserDto: CreateUserDto) {
		return this.userService.createUser(createUserDto)
	}
}
