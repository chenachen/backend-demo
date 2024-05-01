import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import helmet from 'helmet'
import { registerSwagger } from './swagger'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'
import { LoggerService } from './shared/logger/logger.service'
import { APP_CONFIG_TOKEN } from './config/app'
import { TransformInterceptor } from './lifecycle/Interceptors/transform.interceptor'

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        bufferLogs: true,
    })

    // 获取环境变量
    const configService = app.get(ConfigService)
    const logerService = app.get(LoggerService)
    const { port, isDev, globalPrefix } = configService.get(APP_CONFIG_TOKEN, {
        infer: true,
    })

    app.enableCors({ origin: '*', credentials: true })
    app.setGlobalPrefix(globalPrefix)

    // middleware
    app.use(helmet())
    app.useLogger(logerService)
    //
    app.useGlobalInterceptors(
        new TransformInterceptor(configService, logerService),
    )
    // pipe
    app.useGlobalPipes(
        new ValidationPipe({
            disableErrorMessages: !isDev, // 生产环境不提示太具体的参数报错
        }),
    )

    // api doc
    isDev && registerSwagger(app)

    await app.listen(port)
}
bootstrap()
