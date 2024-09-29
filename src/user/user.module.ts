import { Module } from "@nestjs/common"

import { PrismaModule } from "../prisma/prisma.module"

import { UserController } from "./user.controller"
import { UserRepository } from "./user.repository"
import { UserService } from "./user.service"

@Module({
	imports: [PrismaModule],
	providers: [UserService, UserRepository],
	controllers: [UserController],
	exports: [UserRepository]
})
export class UserModule {}
