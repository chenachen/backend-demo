import { Body, Controller, Ip, Post, Headers, Get, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { Public } from 'src/common/decorators/public.decorator'
import { ImageCaptchaDto } from './dto/captcha.dto'
import { ImageCaptcha } from './auth.interface'

@ApiTags('验证模块')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @ApiOperation({ summary: '登录接口' })
    async login(
        @Body() dto: LoginDto,
        @Ip() ip: string,
        @Headers('user-agent') ua: string,
    ) {
        return await this.authService.login(dto, ip, ua)
    }

    @Get('img')
    @ApiOperation({ summary: '获取登录图片验证码' })
    @Public()
    async captchaByImg(
        @Query() dto: ImageCaptchaDto,
        @Ip() ip: string,
    ): Promise<ImageCaptcha> {
        return await this.authService.genCaptcha(dto, ip)
    }
}
