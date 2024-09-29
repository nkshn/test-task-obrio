import { BadRequestException, ValidationPipe } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { NestFactory } from "@nestjs/core"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"

import { AppModule } from "./app.module"
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor"

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		logger: ["log", "error", "warn", "debug", "verbose"]
	})

	const configService = app.get(ConfigService)

	app.enableCors()

	app.getHttpAdapter().getInstance().disable("x-powered-by")
	app.setGlobalPrefix("api")

	app.useGlobalInterceptors(new LoggingInterceptor())

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

	const docsOptions = new DocumentBuilder()
		.setTitle("Obrio Tesk Task API Documentation")
		.setDescription("This is my API documentation for Obria test task.")
		.setVersion("1.0")
		.addServer("http://localhost:3000/", "Local environment")
		.addTag("User")
		.addTag("Offer")
		.addTag("Purchase")
		.build()

	const document = SwaggerModule.createDocument(app, docsOptions)
	SwaggerModule.setup("docs", app, document)

	const port = configService.get<number>("PORT")

	await app.listen(port || 3000)
}

bootstrap()
