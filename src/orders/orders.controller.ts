import {Controller, Get, Post, Body, Param, Patch} from '@nestjs/common'
import {OrdersService} from './orders.service'
import {CreateOrderDto} from './dto/create-order.dto'
import {UpdateOrderDto} from './dto/update-order.dto'
import {Roles} from '../auth/roles.decorator'

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Post()
    createOrder(@Body() createOrderDto: CreateOrderDto) {
        return this.ordersService.createOrder(createOrderDto)
    }

    @Roles('ADMIN')
    @Get()
    findAll() {
        return this.ordersService.findAll()
    }

    @Get('getById/:id')
    getOrderById(@Param('id') id: string) {
        return this.ordersService.getOrderById(id)
    }

    @Get('getByCustomerId/:customerid')
    findOrdersByCustomerId(@Param('customerid') customerId: string) {
        return this.ordersService.findOrdersByCustomerId(customerId)
    }

    @Roles('ADMIN')
    @Patch(':id')
    updateOrderStatus(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
        return this.ordersService.updateOrderStatus(id, updateOrderDto)
    }
}
