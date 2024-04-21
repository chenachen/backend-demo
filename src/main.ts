import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import helmet from 'helmet'
import { registerOpenApi } from './open-api'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    // 获取环境变量
    const configService = app.get(ConfigService)
    const PORT = configService.get('PORT', 3000)
    const IS_DEV = configService.get('NODE_ENV') === 'development'

    // middleware
    app.use(helmet())
    // pipe
    app.useGlobalPipes(
        new ValidationPipe({
            disableErrorMessages: !IS_DEV, // 生产环境不提示太具体的参数报错
        }),
    )

    // api doc
    IS_DEV && registerOpenApi(app)

    await app.listen(PORT)
}
bootstrap()
