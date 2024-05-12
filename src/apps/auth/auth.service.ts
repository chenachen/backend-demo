import { Inject, Injectable } from '@nestjs/common'

import * as svgCaptcha from 'svg-captcha'
import { isEmpty } from 'lodash'

import { RedisProviderKey } from 'src/shared/redis.provider'
import { genCaptchaImgKey } from 'src/common/utils/getRedisKey'
import { BusinessException } from 'src/common/exceptions/business.exception'
import { generateUUID } from 'src/common/utils/tools'
import { ErrorEnum } from 'src/constant/response-code.constant'
import { LoginDto } from './dto/login.dto'
import { ImageCaptchaDto } from './dto/captcha.dto'

import { ImageCaptcha } from './auth.interface'
import { comparePassword } from 'src/common/utils/password-encryption'
import { PrismaService } from 'src/shared/prisma.service'
import { RedisClientType } from 'redis'
import { LoggerService } from 'src/shared/logger/logger.service'

@Injectable()
export class AuthService {
    constructor(
        @Inject(RedisProviderKey) private redisService: RedisClientType,
        private readonly prismaService: PrismaService,
        private readonly loggerService: LoggerService,
    ) {}

    async genCaptcha(dto: ImageCaptchaDto, ip: string): Promise<ImageCaptcha> {
        const { width, height } = dto

        const svg = svgCaptcha.create({
            size: 4,
            color: true,
            noise: 4,
            width: isEmpty(width) ? 100 : width,
            height: isEmpty(height) ? 50 : height,
            charPreset: '1234567890',
        })
        const result = {
            img: `data:image/svg+xml;base64,${Buffer.from(svg.data).toString(
                'base64',
            )}`,
            id: generateUUID(),
        }
        const redisKey = genCaptchaImgKey(result.id)
        await this.redisService.hSet(redisKey, {
            code: svg.text,
            ip,
        })
        // 1分钟过期时间
        this.redisService.expire(redisKey, 60)

        this.loggerService.devLog(
            `生成的验证码是： ${svg.text}`,
            AuthService.name,
        )

        return result
    }

    /**
     * 校验图片验证码
     */
    private async checkImgCaptcha(
        captchaId: string,
        verifyCode: string,
        requestIp: string,
    ): Promise<void> {
        const cacheKey = genCaptchaImgKey(captchaId)
        const { ip, code } = (await this.redisService.hGetAll(cacheKey)) ?? {
            ip: null,
            code: null,
        }

        if (
            verifyCode.toLowerCase() !== code?.toLowerCase() ||
            requestIp !== ip
        ) {
            this.loggerService.warn(
                `用户输入： ip: ${requestIp}，code：${verifyCode}, 实际：ip: ${ip}, code: ${code}`,
                AuthService.name,
            )
            throw new BusinessException(ErrorEnum.INVALID_VERIFICATION_CODE)
        }

        // 校验成功后移除验证码
        await this.redisService.del(cacheKey)
    }

    async login(dto: LoginDto, ip: string, ua: string) {
        const { account, password, captchaId, verifyCode } = dto

        await this.checkImgCaptcha(captchaId, verifyCode, ip)

        const user = await this.prismaService.user.findUnique({
            where: {
                account,
            },
        })

        if (!user || !(await comparePassword(password, user.password))) {
            throw new BusinessException(ErrorEnum.INVALID_USERNAME_PASSWORD)
        }

        // todo: 生成jwt
        console.log(ua)
    }
}
