import { ApiProperty } from '@nestjs/swagger'
import { UserLevel } from '@prisma/client'
import { UserPayload } from '../../types/prisma'
import { Permission, PermissionCode } from '../../constant/permission.constant'

interface UserCacheData {
    user: UserPayload
    ip: string
    ua: string
    refreshToken: string
    accessToken: string
}

export class UserCacheModel {
    @ApiProperty({ type: 'string', description: '用户帐号' })
    account: string

    @ApiProperty({ type: UserLevel, description: '用户等级' })
    userLevel: UserLevel

    @ApiProperty({ type: 'string', description: '用户角色, 使用时需要JSON.parse解析为数组' })
    userRole: string

    @ApiProperty({ type: 'string', description: '登录时用户IP' })
    ip: string

    @ApiProperty({ type: 'string', description: '浏览器的user-agent' })
    ua: string

    @ApiProperty({ type: 'string', description: '颁发给用户的refreshToken' })
    refreshToken: string

    @ApiProperty({ type: 'string', description: '颁发给用户的accessToken' })
    accessToken: string

    constructor(userCacheData: UserCacheData) {
        const { user, ip, ua, refreshToken, accessToken } = userCacheData
        const { account, level } = user

        this.account = account
        this.userLevel = level
        this.ip = ip
        this.ua = ua
        this.refreshToken = refreshToken
        this.accessToken = accessToken
        this.userRole = this.getPermissionCode(user)
    }

    private getPermissionCode(user: UserPayload) {
        if (!user.role) {
            return JSON.stringify([])
        }

        const permissionList: PermissionCode[] = []

        function traverse(list: unknown[]) {
            list.forEach((item) => {
                const { selected, code, children } = item as Permission

                if (selected) {
                    permissionList.push(code)
                }
                if (children) {
                    traverse(children)
                }
            })
        }
        traverse(user.role.permissions)

        return JSON.stringify(permissionList)
    }
}
