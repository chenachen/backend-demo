import { Body, Controller, Get, Headers, Ip, Post, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { Public } from 'src/common/decorators/public.decorator'
import { ImageCaptchaDto } from './dto/captcha.dto'
import { ImageCaptcha } from './auth.interface'
import { AuthUser } from '../../common/decorators/auth-user.decorator'
import { TokenPayload } from '../../shared/token.service'

@ApiTags('验证模块')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @Post('login')
    @ApiOperation({ summary: '登录接口' })
    async login(@Body() dto: LoginDto, @Ip() ip: string, @Headers('user-agent') ua: string) {
        return await this.authService.login(dto, ip, ua)
    }

    @Public()
    @Get('img')
    @ApiOperation({ summary: '获取登录图片验证码' })
    @Public()
    async captchaByImg(@Query() dto: ImageCaptchaDto, @Ip() ip: string): Promise<ImageCaptcha> {
        return await this.authService.genCaptcha(dto, ip)
    }

    @ApiBearerAuth()
    @Post('logout')
    @ApiOperation({ summary: '登出接口' })
    async logout(@AuthUser() user: TokenPayload) {
        return await this.authService.logout(user)
    }
}
