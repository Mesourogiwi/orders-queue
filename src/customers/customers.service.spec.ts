import {Test, TestingModule} from '@nestjs/testing'
import {CustomersService} from './customers.service'
import {PrismaService} from '../prisma.service'
import {JwtService} from '@nestjs/jwt'
import {BadRequestException} from '@nestjs/common'
import {faker} from '@faker-js/faker/locale/pt_BR'

describe('CustomersService', () => {
    let service: CustomersService
    const prismaMock = {
        customer: {
            findFirst: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        }
    }

    const jwtMockService = {
        sign: jest.fn()
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CustomersService,
                JwtService,
                {
                    provide: PrismaService,
                    useValue: prismaMock
                },
                {
                    provide: JwtService,
                    useValue: jwtMockService
                }
            ]
        }).compile()

        service = module.get<CustomersService>(CustomersService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('test createCustomer', () => {
        it('should throw if cpf is invalid', async () => {
            const createCustomerInput = {
                name: faker.person.firstName(),
                email: faker.internet.email(),
                cpf: '1234567890',
                password: faker.internet.password()
            }

            await expect(service.createCustomer(createCustomerInput)).rejects.toThrow(
                BadRequestException
            )
        })

        it('should throw if customer already exists', async () => {
            const createCustomerInput = {
                name: faker.person.firstName(),
                email: faker.internet.email(),
                cpf: '243.771.463-43',
                password: faker.internet.password()
            }

            prismaMock.customer.findFirst.mockResolvedValue(createCustomerInput)

            await expect(service.createCustomer(createCustomerInput)).rejects.toThrow(
                BadRequestException
            )
        })

        it('should create a customer', async () => {
            const createCustomerInput = {
                name: faker.person.firstName(),
                email: faker.internet.email(),
                cpf: '243.771.463-43',
                password: faker.internet.password()
            }

            prismaMock.customer.findFirst.mockResolvedValue(null)
            prismaMock.customer.create.mockResolvedValue(createCustomerInput)
            jwtMockService.sign.mockResolvedValueOnce(faker.string.uuid())

            const customer = await service.createCustomer(createCustomerInput)

            expect(customer).toBeDefined()
            expect(customer.accessToken).toBeDefined()
        })
    })

    describe('test findAll customers', () => {
        it('should find all customers', async () => {
            const mockCustomers = [{id: faker.string.uuid()}, {id: faker.string.uuid()}]
            prismaMock.customer.findMany.mockResolvedValue(mockCustomers)

            const customers = await service.findAll()

            expect(customers).toBeDefined()
            expect(customers.length).toBeGreaterThan(0)
        })
    })

    describe('test find customer by id', () => {
        it('should throw error if customer not found', async () => {
            const customerId = faker.string.uuid()
            prismaMock.customer.findUnique.mockResolvedValue(null)

            await expect(service.getById(customerId)).rejects.toThrow(BadRequestException)
        })
        it('should find a customer by id', async () => {
            const customerId = faker.string.uuid()
            const mockCustomer = {id: customerId}
            prismaMock.customer.findUnique.mockResolvedValue(mockCustomer)

            const customer = await service.getById(customerId)

            expect(customer).toBeDefined()
            expect(customer.id).toEqual(customerId)
        })
    })

    describe('test find customer by cpf', () => {
        it('should throw error if customer not found', async () => {
            const customerId = faker.string.uuid()
            prismaMock.customer.findUnique.mockResolvedValue(null)

            await expect(service.getById(customerId)).rejects.toThrow(BadRequestException)
        })
        it('should find a customer by cpf', async () => {
            const cpf = '243.771.463-43'
            const mockCustomer = {cpf}

            prismaMock.customer.findUnique.mockResolvedValue(mockCustomer)

            const customer = await service.getByCpf(cpf)

            expect(customer).toBeDefined()
            expect(customer.cpf).toEqual(cpf)
        })
    })

    describe('test update customer', () => {
        it('should throw error if customer not found', async () => {
            const customerId = faker.string.uuid()
            prismaMock.customer.findUnique.mockResolvedValue(null)

            await expect(service.update(customerId, {})).rejects.toThrow(BadRequestException)
        })
        it('should update a customer', async () => {
            const customerId = faker.string.uuid()
            const data = {
                name: faker.person.firstName()
            }

            prismaMock.customer.findUnique.mockResolvedValue({id: customerId})
            prismaMock.customer.update.mockResolvedValue({name: data.name})

            const customer = await service.update(customerId, data)

            expect(customer).toBeDefined()
            expect(customer.name).toEqual(data.name)
        })
    })

    describe('test delete customer', () => {
        it('should throw error if customer not found', async () => {
            const customerId = faker.string.uuid()
            prismaMock.customer.findUnique.mockResolvedValue(null)

            await expect(service.remove(customerId)).rejects.toThrow(BadRequestException)
        })

        it('should delete a customer', async () => {
            const customerId = faker.string.uuid()
            prismaMock.customer.findUnique.mockResolvedValue({id: customerId})
            const deleted = await service.remove(customerId)

            expect(deleted).toBeTruthy()
        })
    })
})
