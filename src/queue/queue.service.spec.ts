import { getQueueToken } from "@nestjs/bullmq"
import { Logger } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"

import { QueueTiming } from "./constants/queue-constants"
import { JobNames } from "./enums/queue-names.enum"
import { QueueService } from "./queue.service"

describe("QueueService", () => {
	let service: QueueService

	const mockQueueProvider = {
		add: jest.fn(),
		process: jest.fn()
	}

	beforeEach(async () => {
		jest.spyOn(Logger.prototype, "log").mockImplementation(() => {})
		jest.spyOn(Logger.prototype, "error").mockImplementation(() => {})

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				QueueService,
				{
					provide: getQueueToken("astrology-report"),
					useValue: mockQueueProvider
				}
			]
		}).compile()

		service = module.get<QueueService>(QueueService)
	})

	it("should be defined", () => {
		expect(service).toBeDefined()
	})

	it("should add astrology report job to the queue", async () => {
		const jobData = { userId: 1 }
		await service.addAstrologyReportJob(jobData)

		expect(mockQueueProvider.add).toHaveBeenCalledWith(
			JobNames.SEND_ASTROLOGY_REPORT,
			jobData,
			{
				delay: QueueTiming.HOURS_24_ASTROLOGY_REPORT_DELAY,
				attempts: 3
			}
		)
	})

	it("should throw an error if adding the job fails", async () => {
		const jobData = { userId: 1 }

		// Mocking add to throw an error
		mockQueueProvider.add.mockRejectedValue(new Error("Queue Error"))

		await expect(service.addAstrologyReportJob(jobData)).rejects.toThrow(
			"Queue Error"
		)
	})
})
