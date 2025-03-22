import {Controller, Get, Post, Body, Param} from '@nestjs/common'
import {OrdersService} from './orders.service'
import {CreateOrderDto} from './dto/create-order.dto'

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Post()
    create(@Body() createOrderDto: CreateOrderDto) {
        return this.ordersService.createOrder(createOrderDto)
    }

    @Get()
    findAll() {
        return this.ordersService.findAll()
    }

    @Get('getById/:id')
    findOne(@Param('id') id: string) {
        return this.ordersService.getdOrderById(id)
    }

    @Get('getByCustomerId/:customerid')
    findMany(@Param('customerid') customerId: string) {
        return this.ordersService.findOrdersByCustomerId(customerId)
    }
}
