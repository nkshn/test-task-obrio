import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq"
import { Logger } from "@nestjs/common"
import { Job } from "bullmq"

import { HttpRequestService } from "../../http-request/http-request.service"

import { JobNames, QueueNames } from "../enums/queue-names.enum"

@Processor(QueueNames.ASTROLOGY_REPORT)
export class AstrologyReportConsumer extends WorkerHost {
	private readonly logger = new Logger(AstrologyReportConsumer.name)

	constructor(private readonly httpRequestService: HttpRequestService) {
		super()
	}

	@OnWorkerEvent("active")
	onActive(job: Job) {
		this.logger.log(`Processing job ${job.name} with id ${job.id}`)
	}

	@OnWorkerEvent("completed")
	onCompleted(job: Job) {
		this.logger.log(`Job ${job.name} with id ${job.id} has been completed`)
	}

	@OnWorkerEvent("failed")
	onFailed(job: Job, error: Error) {
		this.logger.error(
			`Job ${job.name} with id ${job.id} has failed with error: ${error.message}`
		)
	}

	@OnWorkerEvent("progress")
	onProgress(job: Job, progress: number) {
		this.logger.log(`Job ${job.name} with id ${job.id} is ${progress}% done`)
	}

	async process(job: Job<any, any, string>): Promise<any> {
		try {
			switch (job.name) {
				case JobNames.SEND_ASTROLOGY_REPORT: {
					const { userId } = job.data
					this.logger.log(`Processing astrology report for user ID: ${userId}`)

					// Simulate sending a request to a third-party API
					await this.httpRequestService.sendFakeRequest()

					this.logger.log(`Astrology report sent to user ID: ${userId}`)

					return { status: "success" }
				}
				default:
					throw new Error(`Unknown job name: ${job.name}`)
			}
		} catch (error) {
			this.logger.error(`Error processing job ${job.name}: ${error.message}`)
			throw error
		}
	}
}
