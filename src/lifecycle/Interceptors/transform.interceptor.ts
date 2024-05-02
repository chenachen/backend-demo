import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { isObject } from 'lodash'
import { SUCCESS_CODE } from 'src/constant/response-code.constant'

@Injectable()
export class TransformInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> {
        return next.handle().pipe(
            map((data) => {
                if (data?.data && data?.message) {
                    return {
                        ...data,
                        code: SUCCESS_CODE,
                    }
                } else if (isObject(data)) {
                    return {
                        data,
                        message: '',
                        code: SUCCESS_CODE,
                    }
                }

                return data
            }),
        )
    }
}
