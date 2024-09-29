import {
	Injectable,
	Logger,
	OnModuleDestroy,
	OnModuleInit
} from "@nestjs/common"
import { PrismaClient } from "@prisma/client"

@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy
{
	private readonly logger = new Logger(PrismaService.name)

	async onModuleInit() {
		this.logger.log("Connecting to the database...")
		try {
			await this.$connect()
			this.logger.log("Connected to the database successfully.")
		} catch (error) {
			this.logger.error("Failed to connect to the database.", error)
		}
	}

	async onModuleDestroy() {
		this.logger.log("Disconnecting from the database...")
		try {
			await this.$disconnect()
			this.logger.log("Disconnected from the database.")
		} catch (error) {
			this.logger.error("Failed to disconnect from the database.", error)
		}
	}
}
