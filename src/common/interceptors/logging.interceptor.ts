import {
	CallHandler,
	ExecutionContext,
	Injectable,
	Logger,
	NestInterceptor
} from "@nestjs/common"
import { Observable, throwError } from "rxjs"
import { catchError, tap } from "rxjs/operators"

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	private readonly logger = new Logger(LoggingInterceptor.name)

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const request = context.switchToHttp().getRequest()
		const { method, url } = request

		this.logger.log(`Incoming Request: ${method} ${url}`)

		const now = Date.now()

		return next.handle().pipe(
			tap(() => {
				this.logger.log(`Request ${method} ${url} took ${Date.now() - now}ms`)
			}),
			catchError(error => {
				this.logger.error(
					`Request ${method} ${url} failed after ${Date.now() - now}ms`,
					error.stack
				)
				return throwError(() => error)
			})
		)
	}
}
