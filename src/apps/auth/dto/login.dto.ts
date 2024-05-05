import { ApiProperty } from '@nestjs/swagger'
import { IsString, MaxLength, MinLength } from 'class-validator'

export class LoginDto {
    @ApiProperty({ description: '帐号' })
    @IsString()
    @MinLength(4)
    @MaxLength(16)
    account: string

    @ApiProperty({ description: '密码', example: 'a123456' })
    @IsString()
    @MinLength(6)
    @MaxLength(32)
    password: string

    @ApiProperty({ description: '验证码标识' })
    @IsString()
    captchaId: string

    @ApiProperty({ description: '用户输入的验证码' })
    @IsString()
    @MinLength(4)
    @MaxLength(4)
    verifyCode: string
}
