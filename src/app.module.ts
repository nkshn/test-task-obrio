import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"

import { HttpRequestModule } from "./http-request/http-request.module"
import { OfferModule } from "./offer/offer.module"
import { PrismaModule } from "./prisma/prisma.module"
import { PurchaseModule } from "./purchase/purchase.module"
import { QueueModule } from "./queue/queue.module"
import { UserModule } from "./user/user.module"

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true
		}),
		UserModule,
		PrismaModule,
		OfferModule,
		PurchaseModule,
		QueueModule,
		HttpRequestModule
	]
})
export class AppModule {}
