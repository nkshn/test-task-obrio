import { HttpService } from "@nestjs/axios"
import { Injectable, Logger } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { lastValueFrom } from "rxjs"

@Injectable()
export class HttpRequestService {
	private readonly logger = new Logger(HttpRequestService.name)
	private readonly fakeApiUrl: string

	constructor(
		private readonly httpService: HttpService,
		private readonly configService: ConfigService
	) {
		this.fakeApiUrl = this.configService.get<string>("FAKE_API_URL")
	}

	async sendFakeRequest(): Promise<any> {
		this.logger.log(`Sending fake HTTP request to ${this.fakeApiUrl}`)

		try {
			const response = await lastValueFrom(
				this.httpService.get(this.fakeApiUrl)
			)
			this.logger.log("Fake HTTP request was successful!")
			return response.data
		} catch (error) {
			this.logger.error(`Failed to send fake HTTP request: ${error.message}`)
			throw error
		}
	}
}
