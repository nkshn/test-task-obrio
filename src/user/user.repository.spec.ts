import { Test, TestingModule } from "@nestjs/testing"

import { PrismaService } from "../prisma/prisma.service"

import { UserRepository } from "./user.repository"

describe("UserRepository", () => {
	let repository: UserRepository
	let prisma: PrismaService

	const mockPrismaService = {
		user: {
			findUnique: jest.fn(),
			findMany: jest.fn(),
			create: jest.fn()
		}
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UserRepository,
				{ provide: PrismaService, useValue: mockPrismaService }
			]
		}).compile()

		repository = module.get<UserRepository>(UserRepository)
		prisma = module.get<PrismaService>(PrismaService)
	})

	it("should be defined", () => {
		expect(repository).toBeDefined()
	})

	it("should return a user by ID", async () => {
		const mockUser = { id: 1, email: "test@example.com" }
		mockPrismaService.user.findUnique.mockResolvedValue(mockUser)

		const result = await repository.findById(1)
		expect(result).toEqual(mockUser)
		expect(prisma.user.findUnique).toHaveBeenCalledWith({
			where: { id: 1 }
		})
	})

	it("should return a user by email", async () => {
		const mockUser = { id: 1, email: "test@example.com" }
		mockPrismaService.user.findUnique.mockResolvedValue(mockUser)

		const result = await repository.findByEmail("test@example.com")
		expect(result).toEqual(mockUser)
		expect(prisma.user.findUnique).toHaveBeenCalledWith({
			where: { email: "test@example.com" }
		})
	})

	it("should return all users", async () => {
		const mockUsers = [
			{ id: 1, email: "test@example.com" },
			{ id: 2, email: "john@example.com" }
		]
		mockPrismaService.user.findMany.mockResolvedValue(mockUsers)

		const result = await repository.findAllUsers()
		expect(result).toEqual(mockUsers)
		expect(prisma.user.findMany).toHaveBeenCalled()
	})

	it("should create a new user", async () => {
		const mockUser = { id: 1, email: "test@example.com" }
		mockPrismaService.user.create.mockResolvedValue(mockUser)

		const result = await repository.createUser("test@example.com", "Subscribed")
		expect(result).toEqual(mockUser)
		expect(prisma.user.create).toHaveBeenCalledWith({
			data: { email: "test@example.com", marketingData: "Subscribed" }
		})
	})
})
