import { Inject, Injectable } from '@nestjs/common'

import { RedisClientType } from 'redis'
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

@Injectable()
export class AuthService {
    constructor(
        @Inject(RedisProviderKey) private redisService: RedisClientType,
    ) {}

    async genCaptcha(dto: ImageCaptchaDto): Promise<ImageCaptcha> {
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
        // 3分钟过期时间
        await this.redisService.set(genCaptchaImgKey(result.id), svg.text, {
            EX: 60 * 3,
        })

        return result
    }

    /**
     * 校验图片验证码
     */
    private async checkImgCaptcha(id: string, code: string): Promise<void> {
        const cacheKey = genCaptchaImgKey(id)
        const result = await this.redisService.get(cacheKey)
        if (isEmpty(result) || code.toLowerCase() !== result.toLowerCase()) {
            throw new BusinessException(ErrorEnum.INVALID_VERIFICATION_CODE)
        }

        // 校验成功后移除验证码
        await this.redisService.del(cacheKey)
    }

    async login(dto: LoginDto, ip: string, ua: string) {
        const { account, password, captchaId, verifyCode } = dto
        console.log(account, password, ip, ua)
        await this.checkImgCaptcha(captchaId, verifyCode)
        throw new Error('Method not implemented.')
    }
}
