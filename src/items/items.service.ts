import {BadRequestException, Injectable} from '@nestjs/common'
import {CreateItemDto} from './dto/create-item.dto'
import {UpdateItemDto} from './dto/update-item.dto'
import {PrismaService} from '../prisma.service'
import {Item} from '@prisma/client'

@Injectable()
export class ItemsService {
    constructor(private readonly prisma: PrismaService) {}
    async create(createItemDto: CreateItemDto): Promise<Item> {
        if (createItemDto.quantity <= 0) {
            throw new BadRequestException('Quantity must be greater than 0', {
                cause: new Error('Quantity must be greater than 0'),
                description: 'Quantidade deve ser maior que 0'
            })
        }

        if (createItemDto.price <= 0) {
            throw new BadRequestException('Price must be greater than 0', {
                cause: new Error('Price must be greater than 0'),
                description: 'Preço deve ser maior que 0'
            })
        }

        const item = await this.prisma.item.create({data: createItemDto})
        return item
    }

    async findAll(): Promise<Item[]> {
        const items = await this.prisma.item.findMany()
        return items
    }

    async getById(id: string): Promise<Item | null> {
        const item = await this.prisma.item.findUnique({where: {id}})

        return item
    }

    async update(id: string, updateItemDto: Partial<UpdateItemDto>): Promise<Item> {
        const item = await this.getById(id)

        if (!item) {
            throw new BadRequestException('Item not found', {
                cause: new Error('Item not found'),
                description: 'Item não encontrado na base'
            })
        }

        if (updateItemDto.quantity && updateItemDto.quantity < 0) {
            throw new BadRequestException('Quantity must be a positive number', {
                cause: new Error('Quantity must be a positive number'),
                description: 'Quantidade deve ser um número positivo'
            })
        }

        if (updateItemDto.price && updateItemDto.price <= 0) {
            throw new BadRequestException('Price must be greater than 0', {
                cause: new Error('Price must be greater than 0'),
                description: 'Preço deve ser maior que 0'
            })
        }

        const updatedItem = await this.prisma.item.update({
            where: {id: item.id},
            data: updateItemDto
        })
        return updatedItem
    }

    async remove(id: string): Promise<boolean> {
        const item = await this.getById(id)

        if (!item) {
            throw new BadRequestException('Item not found', {
                cause: new Error('Item not found'),
                description: 'Item não encontrado na base'
            })
        }

        await this.prisma.item.delete({where: {id}})
        return true
    }
}
