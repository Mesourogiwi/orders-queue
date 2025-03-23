import {Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common'
import {CustomersService} from './customers.service'
import {CreateCustomerDto} from './dto/create-customer.dto'
import {UpdateCustomerDto} from './dto/update-customer.dto'
import {Public} from '../auth/constants/constants'
import {Roles} from '../auth/roles.decorator'

@Controller('customers')
export class CustomersController {
    constructor(private readonly customersService: CustomersService) {}

    @Public()
    @Post()
    create(@Body() createCustomerDto: CreateCustomerDto) {
        return this.customersService.createCustomer(createCustomerDto)
    }

    @Roles('ADMIN')
    @Get()
    findAll() {
        return this.customersService.findAll()
    }

    @Get('getById/:id')
    getById(@Param('id') id: string) {
        return this.customersService.getById(id)
    }

    @Get('getByCpf/:cpf')
    getByCpf(@Param('cpf') cpf: string) {
        return this.customersService.getByCpf(cpf)
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
        return this.customersService.update(id, updateCustomerDto)
    }

    @Roles('ADMIN')
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.customersService.remove(id)
    }
}
