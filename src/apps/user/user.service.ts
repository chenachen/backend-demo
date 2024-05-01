import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { PrismaService } from 'src/shared/prisma.service'
@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService) {}

    async create(createUserDto: CreateUserDto) {
        const user = await this.prismaService.user.findUnique({
            where: {
                account: createUserDto.account,
            },
        })
        console.log(user)

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
        return `This action returns all user`
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
