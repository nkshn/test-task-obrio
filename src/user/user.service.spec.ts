import { Test, TestingModule } from "@nestjs/testing"

import { UserRepository } from "./user.repository"
import { UserService } from "./user.service"

describe("UserService", () => {
	let service: UserService

	const mockUserRepository = {
		findByEmail: jest.fn(),
		createUser: jest.fn(),
		findAllUsers: jest.fn()
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UserService,
				{ provide: UserRepository, useValue: mockUserRepository }
			]
		}).compile()

		service = module.get<UserService>(UserService)
	})

	it("should be defined", () => {
		expect(service).toBeDefined()
	})

	it("should create a user successfully", async () => {
		mockUserRepository.findByEmail.mockResolvedValue(null)
		mockUserRepository.createUser.mockResolvedValue({
			id: 1,
			email: "test@example.com"
		})

		const result = await service.createUser({
			email: "test@example.com",
			marketingData: "some data"
		})

		expect(result).toEqual({
			id: 1,
			email: "test@example.com"
		})
		expect(mockUserRepository.createUser).toHaveBeenCalledWith(
			"test@example.com",
			"some data"
		)
	})

	it("should throw an error if user already exists", async () => {
		mockUserRepository.findByEmail.mockResolvedValue({
			id: 1,
			email: "existing@example.com"
		})

		await expect(
			service.createUser({
				email: "existing@example.com",
				marketingData: "some data"
			})
		).rejects.toThrow()
	})

	it("should return all users", async () => {
		const users = [
			{ id: 1, email: "test1@example.com" },
			{ id: 2, email: "test2@example.com" }
		]

		mockUserRepository.findAllUsers.mockResolvedValue(users)

		const result = await service.getAllUsers()

		expect(result).toEqual(users)
		expect(mockUserRepository.findAllUsers).toHaveBeenCalled()
	})
})
