import { Global, Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { LoggerModule } from './logger/logger.module'
import { RedisProvider } from './redis.provider'

@Global()
@Module({
    exports: [PrismaService, RedisProvider],
    providers: [PrismaService, RedisProvider],
    imports: [LoggerModule.forRoot()],
})
export class SharedModule {}
