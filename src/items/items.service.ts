import {BadRequestException, Injectable} from '@nestjs/common'
import {CreateItemDto} from './dto/create-item.dto'
import {UpdateItemDto} from './dto/update-item.dto'
import {PrismaService} from '../prisma.service'
import {Item} from '@prisma/client'

@Injectable()
export class ItemsService {
    constructor(private readonly prisma: PrismaService) {}
    async create(createItemDto: CreateItemDto): Promise<Item> {
        const item = await this.prisma.item.create({data: createItemDto})
        return item
    }

    async findAll(): Promise<Item[]> {
        const items = await this.prisma.item.findMany()
        return items
    }

    async getById(id: string): Promise<Item> {
        const item = await this.prisma.item.findUnique({where: {id}})

        if (!item) {
            throw new BadRequestException('Item not found', {
                cause: new Error('Item not found'),
                description: 'Item não encontrado na base'
            })
        }

        return item
    }

    async update(id: string, updateItemDto: UpdateItemDto): Promise<Item> {
        const item = await this.getById(id)

        const updatedItem = await this.prisma.item.update({
            where: {id: item.id},
            data: updateItemDto
        })
        return updatedItem
    }

    async remove(id: string): Promise<boolean> {
        await this.prisma.item.delete({where: {id}})
        return true
    }
}
