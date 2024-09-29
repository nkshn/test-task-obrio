import { Test, TestingModule } from "@nestjs/testing"

import { UserController } from "./user.controller"
import { UserService } from "./user.service"

describe("UserController", () => {
	let controller: UserController

	const mockUserService = {
		getAllUsers: jest.fn(),
		createUser: jest.fn()
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UserController],
			providers: [{ provide: UserService, useValue: mockUserService }]
		}).compile()

		controller = module.get<UserController>(UserController)
	})

	it("should be defined", () => {
		expect(controller).toBeDefined()
	})

	it("should return the result", async () => {
		const users = [{ id: 1, email: "test@example.com" }]
		mockUserService.getAllUsers.mockResolvedValue(users)

		const result = await controller.getAllUsers()
		expect(result).toEqual(users)
		expect(mockUserService.getAllUsers).toHaveBeenCalled()
	})

	it("should return the result", async () => {
		const createUserDto = {
			email: "test@example.com",
			marketingData: "some data"
		}
		const user = { id: 1, email: "test@example.com" }
		mockUserService.createUser.mockResolvedValue(user)

		const result = await controller.createUser(createUserDto)
		expect(result).toEqual(user)
		expect(mockUserService.createUser).toHaveBeenCalledWith(createUserDto)
	})
})
