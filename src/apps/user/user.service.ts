import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { PrismaService } from 'src/shared/prisma.service'
import { comparePassword, passwordEncryption } from '../../common/utils/password-encryption'
import { UserListDto } from '../auth/dto/user-list.dto'
import { excludeField } from '../../common/utils/prisma-helper'
import { User } from '@prisma/client'
import { BusinessException } from '../../common/exceptions/business.exception'
import { ErrorEnum } from '../../constant/response-code.constant'
import { UpdatePasswordDto } from './dto/update-password.dto'
import { TokenPayload } from '../../shared/token.service'

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService) {}

    async create(createUserDto: CreateUserDto) {
        const user = await this.prismaService.user.findUnique({
            where: {
                account: createUserDto.account,
            },
        })

        if (user) {
            return {
                message: '用户已存在',
            }
        }

        await this.prismaService.user.create({
            data: {
                account: createUserDto.account,
                nickname: createUserDto.nickname,
                password: await passwordEncryption(createUserDto.password),
                role: createUserDto.role,
            },
        })

        return {}
    }

    async findAll(userListDto: UserListDto): Promise<Omit<User, 'password'>[]> {
        const { sortOrder, sortName, take, skip, searchText, searchType } = userListDto

        const orderBy = {
            [sortName]: sortOrder,
        }

        let where
        if (searchType && searchText) {
            where = {
                [searchType]: {
                    contains: searchText,
                },
            }
        }

        const users = await this.prismaService.user.findMany({
            where,
            take,
            skip,
            orderBy,
        })

        return excludeField(users, ['password'])
    }

    async findOne(id: number): Promise<Omit<User, 'password'> | null> {
        const user = await this.getUserById(id)

        return excludeField(user, ['password'])
    }

    private async getUserById(id: number) {
        return await this.prismaService.user.findUnique({
            where: {
                id,
            },
        })
    }

    private async getUserOrThrowNotExist(id: number) {
        const user = await this.getUserById(id)

        if (!user) {
            throw new BusinessException(ErrorEnum.USER_NOT_FOUND)
        }

        return user
    }

    async update(updateUserDto: UpdateUserDto) {
        const { id, ...data } = updateUserDto

        await this.getUserOrThrowNotExist(id)

        await this.prismaService.user.update({
            where: {
                id,
            },
            data,
        })
    }

    async remove(id: number) {
        await this.getUserOrThrowNotExist(id)

        await this.prismaService.user.delete({
            where: {
                id,
            },
        })
    }

    async updatePassword(updatePasswordDto: UpdatePasswordDto, userInfo: TokenPayload) {
        const { id } = userInfo
        const user = await this.getUserOrThrowNotExist(id)

        const { oldPassword, newPassword } = updatePasswordDto

        const pass = await comparePassword(oldPassword, user.password)

        if (!pass) {
            throw new BusinessException(ErrorEnum.INVALID_PASSWORD)
        }

        await this.prismaService.user.update({
            where: { id },
            data: {
                password: await passwordEncryption(newPassword),
            },
        })
    }
}
