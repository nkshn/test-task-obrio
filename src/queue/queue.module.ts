import { BullModule } from "@nestjs/bullmq"
import { Module } from "@nestjs/common"

import { HttpRequestModule } from "../http-request/http-request.module"

import { AstrologyReportConsumer } from "./consumers/astrology-report.consumer"
import { QueueNames } from "./enums/queue-names.enum"
import { QueueService } from "./queue.service"

@Module({
	imports: [
		BullModule.forRoot({
			connection: {
				host: process.env.REDIS_HOST,
				port: parseInt(process.env.REDIS_PORT, 10)
			},
			defaultJobOptions: {
				removeOnComplete: 1000,
				removeOnFail: 1000,
				attempts: 3
			}
		}),
		BullModule.registerQueue({
			name: QueueNames.ASTROLOGY_REPORT
		}),
		HttpRequestModule
	],
	providers: [QueueService, AstrologyReportConsumer],
	exports: [QueueService]
})
export class QueueModule {}
