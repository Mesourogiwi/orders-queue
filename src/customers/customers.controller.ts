import {Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common'
import {CustomersService} from './customers.service'
import {CreateCustomerDto} from './dto/create-customer.dto'
import {UpdateCustomerDto} from './dto/update-customer.dto'

@Controller('customers')
export class CustomersController {
    constructor(private readonly customersService: CustomersService) {}

    @Post()
    create(@Body() createCustomerDto: CreateCustomerDto) {
        return this.customersService.createCustomer(createCustomerDto)
    }

    @Get()
    findAll() {
        return this.customersService.findAll()
    }

    @Get('getById/:id')
    findOne(@Param('id') id: string) {
        return this.customersService.getById(id)
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
        return this.customersService.update(id, updateCustomerDto)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.customersService.remove(id)
    }
}
