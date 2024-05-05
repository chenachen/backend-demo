import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { PrismaService } from 'src/shared/prisma.service'
import { BusinessException } from 'src/common/exceptions/business.exception'
import { ErrorEnum } from 'src/constant/response-code.constant'

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
                password: createUserDto.password,
                role: createUserDto.role,
            },
        })

        return 'This action adds a new user'
    }

    async findAll() {
        throw new BusinessException(ErrorEnum.INVALID_USERNAME_PASSWORD)
    }

    findOne(id: number) {
        return `This action returns a #${id} user`
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        console.log(updateUserDto)
        return `This action updates a #${id} user`
    }

    remove(id: number) {
        return `This action removes a #${id} user`
    }
}
