import { HttpService } from "@nestjs/axios"
import { Logger } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { Test, TestingModule } from "@nestjs/testing"
import { AxiosRequestHeaders, AxiosResponse } from "axios"
import { of } from "rxjs"

import { HttpRequestService } from "./http-request.service"

describe("HttpRequestService", () => {
	let service: HttpRequestService

	const mockHttpService = {
		get: jest.fn()
	}

	const mockConfigService = {
		get: jest.fn()
	}

	beforeEach(async () => {
		jest.spyOn(Logger.prototype, "log").mockImplementation(() => {})
		jest.spyOn(Logger.prototype, "error").mockImplementation(() => {})

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				HttpRequestService,
				{ provide: HttpService, useValue: mockHttpService },
				{ provide: ConfigService, useValue: mockConfigService }
			]
		}).compile()

		service = module.get<HttpRequestService>(HttpRequestService)
	})

	it("should be defined", () => {
		expect(service).toBeDefined()
	})

	it("should send a fake HTTP request successfully", async () => {
		const fakeApiUrl = "https://jsonplaceholder.typicode.com/posts"
		const response: AxiosResponse = {
			data: {
				userId: 1,
				id: 1,
				title:
					"sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
				body: "quia et suscipit..."
			},
			status: 200,
			statusText: "OK",
			headers: {},
			config: {
				headers: { "Content-Type": "application/json" } as AxiosRequestHeaders
			}
		}

		mockConfigService.get.mockReturnValue(fakeApiUrl)
		mockHttpService.get.mockReturnValue(of(response))

		const result = await service.sendFakeRequest()

		expect(mockConfigService.get).toHaveBeenCalledWith("FAKE_API_URL")
		expect(mockHttpService.get).toHaveBeenCalled()
		expect(result).toEqual(response.data)
	})

	it("should log and throw an error if the HTTP request fails", async () => {
		const fakeApiUrl = "https://jsonplaceholder.typicode.com/posts"
		const error = new Error("Request failed")

		mockConfigService.get.mockReturnValue(fakeApiUrl)
		mockHttpService.get.mockImplementation(() => {
			throw error
		})

		await expect(service.sendFakeRequest()).rejects.toThrow(error)

		expect(Logger.prototype.error).toHaveBeenCalledWith(
			`Failed to send fake HTTP request: ${error.message}`
		)
		expect(mockConfigService.get).toHaveBeenCalledWith("FAKE_API_URL")
		expect(mockHttpService.get).toHaveBeenCalledWith(fakeApiUrl)
	})
})
