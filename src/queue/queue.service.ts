import { InjectQueue } from "@nestjs/bullmq"
import { Injectable, Logger } from "@nestjs/common"
import { Queue } from "bullmq"

import { QueueTiming } from "./constants/queue-constants"
import { JobNames, QueueNames } from "./enums/queue-names.enum"

@Injectable()
export class QueueService {
	private readonly logger = new Logger(QueueService.name)

	constructor(
		@InjectQueue(QueueNames.ASTROLOGY_REPORT)
		private readonly astrologyReportQueue: Queue
	) {}

	async addAstrologyReportJob({ userId }: { userId: number }): Promise<void> {
		try {
			await this.astrologyReportQueue.add(
				JobNames.SEND_ASTROLOGY_REPORT,
				{
					userId
				},
				{
					delay: QueueTiming.HOURS_24_ASTROLOGY_REPORT_DELAY,
					attempts: 3
				}
			)
		} catch (error) {
			this.logger.error(
				`Failed to schedule astrology report job: ${error.message}`
			)
			throw error
		}
	}
}
