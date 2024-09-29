import { getQueueToken } from "@nestjs/bullmq"
import { Test, TestingModule } from "@nestjs/testing"
import { Queue } from "bullmq"

import { QueueTiming } from "./constants/queue-constants"
import { JobNames } from "./enums/queue-names.enum"
import { QueueService } from "./queue.service"

describe("QueueService", () => {
	let service: QueueService
	let mockQueue: Queue

	const mockAstrologyQueue = {
		add: jest.fn()
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				QueueService,
				{
					provide: getQueueToken("astrology-report"),
					useValue: mockAstrologyQueue
				}
			]
		}).compile()

		service = module.get<QueueService>(QueueService)
		mockQueue = module.get<Queue>(getQueueToken("astrology-report"))
	})

	it("should be defined", () => {
		expect(service).toBeDefined()
	})

	it("should add astrology report job to the queue", async () => {
		const jobData = { userId: 1 }
		await service.addAstrologyReportJob(jobData)

		expect(mockQueue.add).toHaveBeenCalledWith(
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
		mockAstrologyQueue.add.mockRejectedValue(new Error("Queue Error"))

		await expect(service.addAstrologyReportJob(jobData)).rejects.toThrow(
			"Queue Error"
		)
	})
})
