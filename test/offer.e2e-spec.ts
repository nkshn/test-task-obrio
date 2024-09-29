import {
	BadRequestException,
	INestApplication,
	ValidationPipe
} from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"
import * as request from "supertest"

import { AppModule } from "../src/app.module"
import { PrismaService } from "../src/prisma/prisma.service"

describe("OfferModule (e2e)", () => {
	let app: INestApplication
	let prismaService: PrismaService

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule]
		}).compile()

		app = moduleFixture.createNestApplication()

		app.useGlobalPipes(
			new ValidationPipe({
				exceptionFactory: errors => {
					const result = errors.map(error => ({
						type: error.property,
						message: error.constraints[Object.keys(error.constraints)[0]]
					}))
					return new BadRequestException(result)
				},
				whitelist: true,
				stopAtFirstError: true,
				forbidNonWhitelisted: true,
				transform: true
			})
		)

		prismaService = app.get(PrismaService)
		await app.init()
	})

	afterEach(async () => {
		await prismaService.offer.deleteMany()
	})

	afterAll(async () => {
		await prismaService.$disconnect()
		await app.close()
	})

	describe("/POST offer", () => {
		it("should create an offer", async () => {
			const createOfferDto = {
				name: "Special Offer",
				price: 100.5
			}

			const response = await request(app.getHttpServer())
				.post("/offer")
				.send(createOfferDto)
				.expect(201)

			expect(response.body.name).toEqual("Special Offer")
			expect(response.body).toEqual({
				id: expect.any(Number),
				name: "Special Offer",
				price: 100.5,
				createdAt: expect.any(String),
				updatedAt: expect.any(String),
				deletedAt: null
			})
		})

		it("should fail to create an offer with invalid price", async () => {
			const createOfferDto = {
				name: "Invalid Price Offer",
				price: -50
			}

			const response = await request(app.getHttpServer())
				.post("/offer")
				.send(createOfferDto)
				.expect(400)

			expect(response.body.message[0]).toEqual({
				type: "price",
				message: "Price must be greater than 0!"
			})
		})

		it("should fail to create a duplicate offer", async () => {
			const createOfferDto = {
				name: "Duplicate Offer",
				price: 200.0
			}

			await request(app.getHttpServer())
				.post("/offer")
				.send(createOfferDto)
				.expect(201)

			const response = await request(app.getHttpServer())
				.post("/offer")
				.send(createOfferDto)
				.expect(400)

			expect(response.body.message).toEqual(
				"Offer with this name already exists"
			)
		})
	})

	describe("/GET offer", () => {
		it("should return all offers", async () => {
			const response = await request(app.getHttpServer())
				.get("/offer")
				.expect(200)
			expect(response.body).toBeInstanceOf(Array)
		})
	})
})
