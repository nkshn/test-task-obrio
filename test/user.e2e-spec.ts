import {
	BadRequestException,
	INestApplication,
	ValidationPipe
} from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"
import * as request from "supertest"

import { AppModule } from "../src/app.module"
import { PrismaService } from "../src/prisma/prisma.service"

describe("UserModule (e2e)", () => {
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
		await prismaService.user.deleteMany()
	})

	afterAll(async () => {
		await prismaService.$disconnect()
		await app.close()
	})

	describe("/POST user", () => {
		it("should create a user", async () => {
			const createUserDto = {
				email: "test@example.com",
				marketingData: "some data"
			}

			const response = await request(app.getHttpServer())
				.post("/user")
				.send(createUserDto)
				.expect(201)

			expect(response.body.email).toEqual("test@example.com")
			expect(response.body).toEqual({
				id: expect.any(Number),
				email: "test@example.com",
				marketingData: "some data",
				createdAt: expect.any(String),
				updatedAt: expect.any(String),
				deletedAt: null
			})
		})

		it("should fail to create a user with invalid email", async () => {
			const createUserDto = {
				email: "invalid-email",
				marketingData: "some data"
			}

			const response = await request(app.getHttpServer())
				.post("/user")
				.send(createUserDto)
				.expect(400)

			expect(response.body.message[0]).toEqual({
				type: "email",
				message: "Email must be a valid email address!"
			})
		})

		it("should fail to create a duplicate user", async () => {
			const createUserDto = {
				email: "test@example.com",
				marketingData: "some data"
			}

			// First attempt - should succeed
			await request(app.getHttpServer())
				.post("/user")
				.send(createUserDto)
				.expect(201)

			const response = await request(app.getHttpServer())
				.post("/user")
				.send(createUserDto)
				.expect(400)

			expect(response.body.message).toEqual(
				"User with this email already exists"
			)
		})
	})

	describe("/GET user", () => {
		it("should return all users", async () => {
			const response = await request(app.getHttpServer())
				.get("/user")
				.expect(200)
			expect(response.body).toBeInstanceOf(Array)
		})
	})
})
