import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { LoggerService } from 'src/shared/logger/logger.service'

/**
 * 统一处理返回接口结果，如果不需要则添加 @Bypass 装饰器
 */
@Injectable()
export class TransformInterceptor implements NestInterceptor {
    constructor(
        private readonly configService: ConfigService,
        private readonly loggerService: LoggerService,
    ) {}

    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> {
        return next.handle().pipe(
            map((data) => {
                // todo: 拦截器还没写完
                // if (typeof data === 'undefined') {
                //   context.switchToHttp().getResponse().status(HttpStatus.NO_CONTENT);
                //   return data;
                // }
                this.loggerService.log(data, TransformInterceptor.name)

                return data
            }),
        )
    }
}
