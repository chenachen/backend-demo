import { UserLevel } from '@prisma/client'
import { IsEnum, Length } from 'class-validator'
import { defaultLengthOptions } from 'src/common/validator/length'
import { ApiProperty } from '@nestjs/swagger'
import { defaultEnumOptions } from '../../../common/validator/enum'

export class CreateUserDto {
    @ApiProperty({ description: '帐号，需要唯一' })
    @Length(6, 16, defaultLengthOptions)
    account: string

    @ApiProperty({ description: '昵称' })
    @Length(2, 16, defaultLengthOptions)
    nickname: string

    @ApiProperty({ description: '密码' })
    @Length(8, 16, defaultLengthOptions)
    password: string

    @ApiProperty({ description: '角色', enum: UserLevel })
    @IsEnum(UserLevel, defaultEnumOptions)
    level: UserLevel
}
