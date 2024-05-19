import { Injectable } from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { ITokenConfig, TOKEN_CONFIG_TOKEN } from '../config/token.config'

interface TokenPayload {
    account: string
    role: UserRole
    id: number
    nickname: string
}

@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async generateToken(payload: TokenPayload) {
        const { refreshTokenOptions, accessTokenOptions } =
            this.configService.get<ITokenConfig>(TOKEN_CONFIG_TOKEN)

        const accessToken = await this.jwtService.signAsync(
            payload,
            accessTokenOptions,
        )
        const refreshToken = await this.jwtService.signAsync(
            payload,
            refreshTokenOptions,
        )

        return {
            accessToken,
            refreshToken,
        }
    }
}
