import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common'
import { BusinessException } from 'src/common/exceptions/business.exception'
import { ResponseModel } from 'src/common/models/response.model'
import { ErrorEnum } from 'src/constant/response-code.constant'

interface myError {
    readonly status: number
    readonly statusCode?: number

    readonly message?: string
}

@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
    constructor(private readonly isDev: boolean) {}

    private readonly logger = new Logger(GlobalExceptionsFilter.name)

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const request = ctx.getRequest()
        const response = ctx.getResponse()

        const url = request.url!

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : (exception as myError)?.status ||
                  (exception as myError)?.statusCode ||
                  HttpStatus.INTERNAL_SERVER_ERROR

        let message =
            (exception as any)?.response?.message ||
            (exception as myError)?.message ||
            `${exception}`

        // 系统内部错误时
        if (
            status === HttpStatus.INTERNAL_SERVER_ERROR &&
            !(exception instanceof BusinessException)
        ) {
            Logger.error(exception, undefined, 'Catch')

            // 生产环境下隐藏错误信息
            if (!this.isDev) message = ErrorEnum.SERVER_ERROR?.split(':')[1]
        } else {
            this.logger.warn(
                `错误信息：(${status}) ${message} Path: ${decodeURI(url)}`,
            )
        }

        const apiErrorCode: number =
            exception instanceof BusinessException
                ? exception.getErrorCode()
                : status

        // 返回基础响应结

        response.status(status).send(ResponseModel.error(apiErrorCode, message))
    }
}
