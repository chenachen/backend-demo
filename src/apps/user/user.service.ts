import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { PrismaService } from 'src/global/prisma.service'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class UserService {
    constructor(
        private prismaService: PrismaService,
        private configService: ConfigService,
    ) {}

    create(createUserDto: CreateUserDto) {
        return 'This action adds a new user'
    }

    async findAll() {
        console.log(
            await this.prismaService.user.findMany(),
            this.configService.get('NODE_ENV'),
        )
        return `This action returns all user`
    }

    findOne(id: number) {
        return `This action returns a #${id} user`
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`
    }

    remove(id: number) {
        return `This action removes a #${id} user`
    }
}
