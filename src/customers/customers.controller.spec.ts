import {Test} from '@nestjs/testing'
import {CustomersController} from './customers.controller'
import {CustomersService} from './customers.service'
import {Customer, Roles} from '@prisma/client'
import {faker} from '@faker-js/faker/locale/pt_BR'
import {PrismaService} from '../prisma.service'
import {CreateCustomerDto} from './dto/create-customer.dto'
import {UpdateCustomerDto} from './dto/update-customer.dto'
describe('CustomersController', () => {
    const customerObject: Customer = {
        id: faker.string.uuid(),
        createdAt: new Date(),
        updatedAt: new Date(),
        name: faker.person.firstName(),
        cpf: faker.string.numeric(11),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: Roles.CUSTOMER
    }

    let customersController: CustomersController
    let customersService: CustomersService

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [CustomersController],
            providers: [
                PrismaService,
                {
                    provide: CustomersService,
                    useValue: {
                        findAll: jest
                            .fn<Promise<Customer[]>, []>()
                            .mockImplementation(async () => [customerObject]),
                        createCustomer: jest
                            .fn<Promise<Customer>, [CreateCustomerDto]>()
                            .mockImplementation(async () => customerObject),
                        getById: jest
                            .fn<Promise<Customer | null>, [string]>()
                            .mockImplementation(async () => customerObject),
                        findOrdersByCustomerId: jest
                            .fn<Promise<Customer[]>, []>()
                            .mockImplementation(async () => [customerObject]),
                        update: jest
                            .fn<Promise<Customer>, [string, UpdateCustomerDto]>()
                            .mockImplementation(async () => customerObject),
                        remove: jest
                            .fn<Promise<boolean>, [string]>()
                            .mockImplementation(async () => true)
                    }
                }
            ]
        }).compile()

        customersService = moduleRef.get(CustomersService)
        customersController = moduleRef.get(CustomersController)
    })

    describe('createCustomer', () => {
        it('should return a customer', async () => {
            const result = customerObject

            const customerToCreate: CreateCustomerDto = {
                name: faker.commerce.productName(),
                cpf: faker.string.numeric(11),
                email: faker.internet.email(),
                password: faker.internet.password()
            }
            expect(await customersController.createCustomer(customerToCreate)).toStrictEqual(result)
        })
    })

    describe('findAll', () => {
        it('should return an array of customers', async () => {
            const result: Customer[] = [customerObject]

            expect(await customersController.findAll()).toStrictEqual(result)
        })
    })

    describe('getById', () => {
        it('should return a customer', async () => {
            const result: Customer = customerObject

            expect(await customersController.getById('1')).toStrictEqual(result)
        })
    })

    describe('updateCustomer', () => {
        it('should return a customer', async () => {
            const result: Customer = customerObject

            expect(
                await customersController.update('1', {
                    name: faker.person.firstName()
                })
            ).toStrictEqual(result)
        })
    })

    describe('removeCustomer', () => {
        it('should return a boolean', async () => {
            const result = true

            expect(await customersController.remove('1')).toStrictEqual(result)
        })
    })
})
