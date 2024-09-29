import { Module } from "@nestjs/common"

import { HttpRequestModule } from "../http-request/http-request.module"
import { OfferRepository } from "../offer/offer.repository"
import { PrismaModule } from "../prisma/prisma.module"
import { QueueModule } from "../queue/queue.module"
import { UserRepository } from "../user/user.repository"

import { PurchaseController } from "./purchase.controller"
import { PurchaseRepository } from "./purchase.repository"
import { PurchaseService } from "./purchase.service"

@Module({
	imports: [PrismaModule, QueueModule, HttpRequestModule],
	providers: [
		PurchaseService,
		PurchaseRepository,
		UserRepository,
		OfferRepository
	],
	controllers: [PurchaseController]
})
export class PurchaseModule {}
