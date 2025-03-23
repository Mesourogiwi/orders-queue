import {Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common'
import {ItemsService} from './items.service'
import {CreateItemDto} from './dto/create-item.dto'
import {UpdateItemDto} from './dto/update-item.dto'
import {Roles} from '../auth/roles.decorator'

@Controller('items')
export class ItemsController {
    constructor(private readonly itemsService: ItemsService) {}

    @Roles('ADMIN')
    @Post()
    create(@Body() createItemDto: CreateItemDto) {
        return this.itemsService.create(createItemDto)
    }

    @Get()
    findAll() {
        return this.itemsService.findAll()
    }

    @Get(':id')
    getById(@Param('id') id: string) {
        return this.itemsService.getById(id)
    }

    @Roles('ADMIN')
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
        return this.itemsService.update(id, updateItemDto)
    }

    @Roles('ADMIN')
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.itemsService.remove(id)
    }
}
