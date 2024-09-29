import { INestApplication, ValidationPipe } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"
import * as request from "supertest"

import { AppModule } from "../src/app.module"
import { PrismaService } from "../src/prisma/prisma.service"

describe("PurchaseModule (e2e)", () => {
	let app: INestApplication
	let prismaService: PrismaService

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule]
		}).compile()

		app = moduleFixture.createNestApplication()

		app.useGlobalPipes(
			new ValidationPipe({
				whitelist: true,
				forbidNonWhitelisted: true,
				transform: true
			})
		)

		prismaService = app.get(PrismaService)
		await app.init()
	})

	afterEach(async () => {
		await prismaService.purchase.deleteMany()
		await prismaService.user.deleteMany()
		await prismaService.offer.deleteMany()
	})

	afterAll(async () => {
		await prismaService.$disconnect()
		await app.close()
	})

	describe("/POST purchase", () => {
		it("should create a purchase successfully", async () => {
			const user = await prismaService.user.create({
				data: {
					email: "testuser@example.com",
					marketingData: "some marketing data"
				}
			})

			const offer = await prismaService.offer.create({
				data: {
					name: "Test Offer",
					price: 99.99
				}
			})

			const createPurchaseDto = {
				userId: user.id,
				offerId: offer.id
			}

			const response = await request(app.getHttpServer())
				.post("/purchase")
				.send(createPurchaseDto)
				.expect(201)

			expect(response.body).toEqual({
				id: expect.any(Number),
				userId: user.id,
				offerId: offer.id,
				createdAt: expect.any(String),
				updatedAt: expect.any(String),
				deletedAt: null
			})
		})

		it("should fail if user does not exist", async () => {
			const offer = await prismaService.offer.create({
				data: {
					name: "Test Offer",
					price: 99.99
				}
			})

			const createPurchaseDto = {
				userId: 9999,
				offerId: offer.id
			}

			await request(app.getHttpServer())
				.post("/purchase")
				.send(createPurchaseDto)
				.expect(400)
		})

		it("should fail if offer does not exist", async () => {
			const user = await prismaService.user.create({
				data: {
					email: "testuser@example.com",
					marketingData: "some marketing data"
				}
			})

			const createPurchaseDto = {
				userId: user.id,
				offerId: 9999
			}

			await request(app.getHttpServer())
				.post("/purchase")
				.send(createPurchaseDto)
				.expect(400)
		})
	})

	describe("/GET purchase", () => {
		it("should return all purchases", async () => {
			const user = await prismaService.user.create({
				data: {
					email: "testuser@example.com",
					marketingData: "some marketing data"
				}
			})

			const offer = await prismaService.offer.create({
				data: {
					name: "Test Offer",
					price: 99.99
				}
			})

			await prismaService.purchase.create({
				data: {
					userId: user.id,
					offerId: offer.id
				}
			})

			const response = await request(app.getHttpServer())
				.get("/purchase")
				.expect(200)

			expect(response.body).toBeInstanceOf(Array)
			expect(response.body[0]).toEqual({
				id: expect.any(Number),
				user: {
					id: user.id,
					email: user.email,
					marketingData: user.marketingData,
					createdAt: expect.any(String),
					updatedAt: expect.any(String),
					deletedAt: null
				},
				offer: {
					id: offer.id,
					name: offer.name,
					price: offer.price,
					createdAt: expect.any(String),
					updatedAt: expect.any(String),
					deletedAt: null
				},
				createdAt: expect.any(String),
				updatedAt: expect.any(String),
				deletedAt: null
			})
		})
	})
})
