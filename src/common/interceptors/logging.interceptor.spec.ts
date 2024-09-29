import { CallHandler, ExecutionContext, Logger } from "@nestjs/common"
import { of } from "rxjs"
import { tap } from "rxjs/operators"

import { LoggingInterceptor } from "./logging.interceptor"

describe("LoggingInterceptor", () => {
	let interceptor: LoggingInterceptor
	let loggerLogSpy: jest.SpyInstance
	let mockExecutionContext: ExecutionContext
	let mockCallHandler: CallHandler

	beforeEach(() => {
		interceptor = new LoggingInterceptor()

		loggerLogSpy = jest.spyOn(Logger.prototype, "log").mockImplementation()

		mockExecutionContext = {
			switchToHttp: jest.fn().mockReturnValue({
				getRequest: jest.fn().mockReturnValue({
					method: "GET",
					url: "/test-url"
				})
			})
		} as unknown as ExecutionContext

		mockCallHandler = {
			handle: jest.fn(() => of("test response"))
		}
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it("should be defined", () => {
		expect(interceptor).toBeDefined()
	})

	it("should log incoming request and request time", done => {
		const nowSpy = jest
			.spyOn(Date, "now")
			.mockReturnValueOnce(1000)
			.mockReturnValueOnce(2000)

		interceptor
			.intercept(mockExecutionContext, mockCallHandler)
			.pipe(
				tap(() => {
					expect(loggerLogSpy).toHaveBeenCalledWith(
						"Incoming Request: GET /test-url"
					)
					expect(loggerLogSpy).toHaveBeenCalledWith(
						"Request GET /test-url took 1000ms"
					)
					expect(mockCallHandler.handle).toHaveBeenCalled()
					done()
				})
			)
			.subscribe()

		nowSpy.mockRestore()
	})
})
