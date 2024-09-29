import { BadRequestException, Injectable, Logger } from "@nestjs/common"

import { CreateUserDto } from "./dto/create-user.dto"
import { UserRepository } from "./user.repository"

@Injectable()
export class UserService {
	private readonly logger = new Logger(UserService.name)

	constructor(private readonly userRepository: UserRepository) {}

	async createUser(dto: CreateUserDto) {
		this.logger.log("Creating new user")

		const { email, marketingData } = dto

		const existingUser = await this.userRepository.findByEmail(email)
		if (existingUser) {
			this.logger.warn(`User with email: ${dto.email} already exists`)
			throw new BadRequestException("User with this email already exists")
		}

		const user = await this.userRepository.createUser(email, marketingData)
		this.logger.log(`User created successfully with ID: ${user.id}`)
		return user
	}

	async getAllUsers() {
		this.logger.log("Get all users")
		return this.userRepository.findAllUsers()
	}
}
