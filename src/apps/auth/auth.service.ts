import { Inject, Injectable } from '@nestjs/common'

import * as svgCaptcha from 'svg-captcha'
import { isEmpty } from 'lodash'

import { RedisProviderKey } from 'src/shared/redis.provider'
import { genCaptchaImgKey, getUserCacheKey } from 'src/common/utils/getRedisKey'
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
import { TokenService } from 'src/shared/token.service'
import { User } from '@prisma/client'
import { UserCacheModel } from 'src/common/models/user-cache.model'

@Injectable()
export class AuthService {
    constructor(
        @Inject(RedisProviderKey) private redisService: RedisClientType,
        private readonly prismaService: PrismaService,
        private readonly loggerService: LoggerService,
        private readonly tokenService: TokenService,
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

        const payload = {
            account: user.account,
            role: user.role,
            id: user.id,
            nickname: user.nickname,
        }
        const token = await this.tokenService.generateToken(payload)

        this.setUserCache({
            user,
            ip,
            ua,
            ...token,
        })

        return token
    }

    private setUserCache(param: {
        ip: string
        ua: string
        accessToken: string
        user: User
        refreshToken: string
    }) {
        const userCacheData = new UserCacheModel(param)
        const {
            user: { account },
        } = param

        const cacheKey = getUserCacheKey(account)

        this.redisService.hSet(cacheKey, { ...userCacheData })
    }
}
