import {BadRequestException, Injectable} from '@nestjs/common'
import {CreateCustomerDto} from './dto/create-customer.dto'
import {UpdateCustomerDto} from './dto/update-customer.dto'
import {PrismaService} from '../prisma.service'
import {Prisma, Customer, Roles} from '@prisma/client'
import {validateCpf} from './utils/validators'
import * as bcrypt from 'bcrypt'
import {JwtService} from '@nestjs/jwt'

type CustomerResponse = Omit<Customer, 'password'>

type CreateCustomerResponse = CustomerResponse & {
    accessToken: string
}

@Injectable()
export class CustomersService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService
    ) {}
    async createCustomer(createCustomerInput: CreateCustomerDto): Promise<CreateCustomerResponse> {
        const isValidCpf = validateCpf(createCustomerInput.cpf)

        if (!isValidCpf) {
            throw new BadRequestException('Invalid CPF', {
                cause: isValidCpf,
                description: 'CPF não válido, verifique se o CPF foi digitado corretamente'
            })
        }
        const existingCustomer = await this.prisma.customer.findFirst({
            where: {
                OR: [
                    {
                        email: createCustomerInput.email
                    },
                    {
                        cpf: createCustomerInput.cpf
                    }
                ]
            }
        })

        if (existingCustomer) {
            throw new BadRequestException('Customer already exists', {
                cause: existingCustomer,
                description: 'Usuário já cadastrado'
            })
        }

        const saltOrRounds = 10
        const hashedPassword = await bcrypt.hash(createCustomerInput.password, saltOrRounds)

        const customer = await this.prisma.customer.create({
            data: {...createCustomerInput, password: hashedPassword},
            omit: {password: true}
        })

        const payload = {id: customer.id, sub: customer.id, role: customer.role}
        const accessToken = this.jwtService.sign(payload)

        return {
            ...customer,
            accessToken
        }
    }

    findAll(): Promise<CustomerResponse[]> {
        return this.prisma.customer.findMany({
            omit: {password: true}
        })
    }

    async getById(customerId: string): Promise<CustomerResponse> {
        const customer = await this.prisma.customer.findUnique({
            where: {id: customerId},
            omit: {password: true}
        })

        if (!customer) {
            throw new BadRequestException('Customer not found', {
                cause: customerId,
                description: `Usuário com id ${customerId} não encontado`
            })
        }
        return customer
    }

    async getByCpf(cpf: string): Promise<CustomerResponse> {
        const customer = await this.prisma.customer.findUnique({
            where: {cpf: cpf},
            omit: {password: true}
        })

        if (!customer) {
            throw new BadRequestException('Customer not found', {
                cause: cpf,
                description: `Usuário com cpf ${cpf} não encontrado`
            })
        }
        return customer
    }

    async update(customerId: string, data: Partial<UpdateCustomerDto>): Promise<CustomerResponse> {
        const customer = await this.prisma.customer.findUnique({
            where: {id: customerId},
            omit: {password: true}
        })

        if (!customer) {
            throw new BadRequestException('Customer not found', {
                cause: customerId,
                description: `Usuário com id ${customerId} não encontado`
            })
        }

        const updatedCustomer = await this.prisma.customer.update({
            where: {id: customerId},
            data,
            omit: {password: true}
        })

        return updatedCustomer
    }

    async remove(customerId: string): Promise<boolean> {
        const customer = await this.prisma.customer.findUnique({
            where: {id: customerId},
            omit: {password: true}
        })

        if (!customer) {
            throw new BadRequestException('Customer not found', {
                cause: customerId,
                description: `Usuário com id ${customerId} não encontado`
            })
        }
        await this.prisma.customer.delete({where: {id: customerId}})

        return true
    }
}
