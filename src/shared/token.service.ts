import { Injectable } from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { ITokenConfig, TOKEN_CONFIG_TOKEN } from '../config/token.config'

export interface TokenPayload {
    account: string
    role: UserRole
    id: number
    nickname: string
}

@Injectable()
export class TokenService {
    private readonly refreshTokenOptions: { expiresIn: string; secret: string }
    private readonly accessTokenOptions: { expiresIn: string; secret: string }
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {
        const { refreshTokenOptions, accessTokenOptions } = this.configService.get<ITokenConfig>(TOKEN_CONFIG_TOKEN)

        this.refreshTokenOptions = refreshTokenOptions
        this.accessTokenOptions = accessTokenOptions
    }

    async generateToken(payload: TokenPayload) {
        const accessToken = await this.jwtService.signAsync(payload, this.accessTokenOptions)
        const refreshToken = await this.jwtService.signAsync(payload, this.refreshTokenOptions)

        return {
            accessToken,
            refreshToken,
        }
    }

    async verifyAccessToken(token: string): Promise<TokenPayload> {
        return await this.jwtService.verifyAsync(token, {
            secret: this.accessTokenOptions.secret,
        })
    }

    async verifyRefreshToken(token: string): Promise<TokenPayload> {
        return await this.jwtService.verifyAsync(token, {
            secret: this.refreshTokenOptions.secret,
        })
    }
}
