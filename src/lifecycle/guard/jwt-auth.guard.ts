import { ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'

import { ExtractJwt } from 'passport-jwt'
import { PUBLIC_KEY } from '../../constant/auth.constant'
import { Request } from 'express'
import { RedisProviderKey } from '../../shared/redis.provider'
import { RedisClientType } from 'redis'
import { TokenService } from '../../shared/token.service'
import { getUserCacheKey } from '../../common/utils/getRedisKey'
import { UserCacheModel } from '../../common/models/user-cache.model'

// https://docs.nestjs.com/recipes/passport#implement-protected-route-and-jwt-strategy-guards
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    jwtFromRequestFn = ExtractJwt.fromAuthHeaderAsBearerToken()

    constructor(
        private reflector: Reflector,
        @Inject(RedisProviderKey) private redisService: RedisClientType,
        private readonly tokenService: TokenService,
    ) {
        super()
    }

    async canActivate(context: ExecutionContext): Promise<any> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ])
        const request = context.switchToHttp().getRequest<Request>()
        const token = this.jwtFromRequestFn(request)

        if (isPublic) {
            return true
        }
        if (!token) {
            throw new UnauthorizedException('用户未登录')
        }

        try {
            const payload = await this.tokenService.verifyAccessToken(token)

            const currUa = request.header('user-agent')
            const currIp = request.ip

            const { account } = payload
            const redisKey = getUserCacheKey(account)
            const userCache = (await this.redisService.hGetAll(redisKey)) as unknown as UserCacheModel | null

            if (!userCache) {
                throw new Error()
            }

            const { ua, ip, accessToken } = userCache
            if (ua !== currUa || ip !== currIp || accessToken !== token) {
                throw new Error()
            }

            request['user'] = payload
        } catch {
            throw new UnauthorizedException('用户未登录')
        }

        return true
    }
}
