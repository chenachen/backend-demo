import { Global, Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { LoggerModule } from './logger/logger.module'

@Global()
@Module({
    exports: [PrismaService],
    providers: [PrismaService],
    imports: [LoggerModule.forRoot()],
})
export class SharedModule {}
