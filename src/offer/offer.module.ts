import { Module } from "@nestjs/common"

import { PrismaModule } from "../prisma/prisma.module"

import { OfferController } from "./offer.controller"
import { OfferRepository } from "./offer.repository"
import { OfferService } from "./offer.service"

@Module({
	imports: [PrismaModule],
	providers: [OfferService, OfferRepository],
	controllers: [OfferController],
	exports: [OfferRepository]
})
export class OfferModule {}
