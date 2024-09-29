import { Injectable } from "@nestjs/common"

import { PrismaService } from "../prisma/prisma.service"

@Injectable()
export class UserRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findById(userId: number) {
		return this.prisma.user.findUnique({
			where: { id: userId }
		})
	}

	async findByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: { email }
		})
	}

	async findAllUsers() {
		return this.prisma.user.findMany()
	}

	async createUser(email: string, marketingData?: string) {
		return await this.prisma.user.create({
			data: { email, marketingData }
		})
	}
}
