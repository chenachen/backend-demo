import { Module } from '@nestjs/common'
import { UserModule } from './apps/user/user.module'
import { ConfigModule } from '@nestjs/config'
import { SharedModule } from './shared/shared.module'
import { AuthModule } from './apps/auth/auth.module'
import configs from './config'

@Module({
    imports: [
        ConfigModule.forRoot({
            // 加载 .env 文件中的环境变量
            envFilePath: ['.env'],
            // 是否在控制台中显示加载的环境变量，默认为 false
            isGlobal: true,
            load: [...Object.values(configs)],
        }),
        UserModule,
        SharedModule,
        AuthModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
