import { Injectable } from '@nestjs/common'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { PERMISSION_LIST } from '../../constant/permission.constant'
import { PrismaService } from '../../shared/prisma.service'
import { BusinessException } from '../../common/exceptions/business.exception'
import { ErrorEnum } from '../../constant/response-code.constant'
import { ResponseModel } from '../../common/models/response.model'
import { RoleListDto } from './dto/role-list.dto'

@Injectable()
export class RolesService {
    constructor(private prismaService: PrismaService) {}

    async create(createRoleDto: CreateRoleDto) {
        const { name, permissions } = createRoleDto

        try {
            await this.prismaService.role.create({
                data: {
                    name,
                    permissions: permissions as Record<string, any>[],
                },
            })
        } catch (err) {
            this.errHandler(err.message)

            throw new Error(err)
        }

        return ResponseModel.success({ message: '创建角色成功' })
    }

    async findAll(roleListDto: RoleListDto) {
        const { sortOrder, sortName, take, skip, searchText, searchType } = roleListDto

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

        return await this.prismaService.role.findMany({
            where,
            take,
            skip,
            orderBy,
        })
    }

    async findOne(id: number) {
        return this.prismaService.role.findUnique({
            where: {
                id,
            },
        })
    }

    async update(updateRoleDto: UpdateRoleDto) {
        const { id, name, permissions } = updateRoleDto

        try {
            await this.prismaService.role.update({
                where: {
                    id,
                },
                data: {
                    name,
                    permissions: permissions as Record<string, any>[],
                },
            })
        } catch (err) {
            this.errHandler(err.message)
        }

        return ResponseModel.success({ message: '更新角色成功' })
    }

    private errHandler(errMessage: string) {
        if (errMessage.includes('Record to update not found')) {
            throw new BusinessException(ErrorEnum.ROLE_NOT_EXIST)
        } else if (errMessage.includes('Unique constraint failed on the fields: (`name`)')) {
            throw new BusinessException(ErrorEnum.ROLE_EXIST)
        }
        throw new Error(errMessage)
    }

    async remove(id: number) {
        try {
            await this.prismaService.role.delete({
                where: { id },
            })
        } catch (err) {
            this.errHandler(err.message)
        }

        return ResponseModel.success({ message: '删除角色成功' })
    }

    getDefaultInfo() {
        return PERMISSION_LIST
    }
}
