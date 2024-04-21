import { Length, IsEnum } from 'class-validator'
import { UserRole } from 'src/constant/user'

export class CreateUserDto {
    @Length(6, 16, {
        message: (args) => {
            const {
                value,
                property,
                constraints: [min, max],
            } = args
            if (!value) {
                return `${property}不能为空`
            }
            return `${property}长度在${min}和${max}之间`
        },
    })
    account: string

    @Length(2, 16)
    nickname: string

    @Length(8, 16)
    password: string

    @IsEnum(UserRole)
    role: UserRole
}
