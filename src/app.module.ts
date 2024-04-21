import { Module } from '@nestjs/common'
import { UserModule } from './apps/user/user.module'
import { ConfigModule } from '@nestjs/config'
import { GlobalModule } from './global/global.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            // 加载 .env 文件中的环境变量
            envFilePath: ['.env'],
            // 是否在控制台中显示加载的环境变量，默认为 false
            isGlobal: true,
        }),
        UserModule,
        GlobalModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
