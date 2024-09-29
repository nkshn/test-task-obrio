import { Logger } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"
import { Job } from "bullmq"

import { HttpRequestService } from "../../http-request/http-request.service"

import { JobNames } from "../enums/queue-names.enum"

import { AstrologyReportConsumer } from "./astrology-report.consumer"

describe("AstrologyReportConsumer", () => {
	let consumer: AstrologyReportConsumer
	let httpRequestService: HttpRequestService

	const mockHttpRequestService = {
		sendFakeRequest: jest.fn()
	}

	beforeEach(async () => {
		jest.spyOn(Logger.prototype, "log").mockImplementation(() => {})
		jest.spyOn(Logger.prototype, "error").mockImplementation(() => {})

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AstrologyReportConsumer,
				{ provide: HttpRequestService, useValue: mockHttpRequestService }
			]
		}).compile()

		consumer = module.get<AstrologyReportConsumer>(AstrologyReportConsumer)
		httpRequestService = module.get<HttpRequestService>(HttpRequestService)
	})

	it("should be defined", () => {
		expect(consumer).toBeDefined()
	})

	it("should process astrology report job successfully", async () => {
		const job = {
			id: 1,
			name: JobNames.SEND_ASTROLOGY_REPORT,
			data: { userId: 1 }
		} as unknown as Job<any, any, string>

		await consumer.process(job)

		expect(httpRequestService.sendFakeRequest).toHaveBeenCalled()
		expect(Logger.prototype.log).toHaveBeenCalledWith(
			"Processing astrology report for user ID: 1"
		)
	})

	it("should log error if processing fails", async () => {
		const job = {
			id: 1,
			name: JobNames.SEND_ASTROLOGY_REPORT,
			data: { userId: 1 }
		} as unknown as Job<any, any, string>

		mockHttpRequestService.sendFakeRequest.mockRejectedValue(
			new Error("Request Error")
		)

		await expect(consumer.process(job)).rejects.toThrow("Request Error")
		expect(Logger.prototype.error).toHaveBeenCalledWith(
			"Error processing job send-astrology-report: Request Error"
		)
	})
})
