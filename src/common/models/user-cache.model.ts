import { ApiProperty } from '@nestjs/swagger'
import { User, UserRole } from '@prisma/client'

export class UserCacheModel {
    @ApiProperty({ type: 'string', description: '用户帐号' })
    account: string

    @ApiProperty({ type: UserRole, description: '用户角色' })
    userRole: UserRole

    @ApiProperty({ type: 'string', description: '登录时用户IP' })
    ip: string

    @ApiProperty({ type: 'string', description: '浏览器的user-agent' })
    ua: string

    @ApiProperty({ type: 'string', description: '颁发给用户的token' })
    token: string

    constructor(user: User, ip: string, ua: string, token: string) {
        const { account, role } = user
        this.account = account
        this.userRole = role
        this.ip = ip
        this.ua = ua
        this.token = token
    }
}
