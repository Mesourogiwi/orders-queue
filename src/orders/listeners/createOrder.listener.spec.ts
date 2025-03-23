import {Test, TestingModule} from '@nestjs/testing'
import {CreateOrderListener} from './createOrder.listener'
import {PrismaService} from '../../prisma.service'
import {BadRequestException} from '@nestjs/common'
import {faker} from '@faker-js/faker/locale/pt_BR'

describe('createOrderListener', () => {
    let service: CreateOrderListener
    const prismaMock = {
        $transaction: jest.fn().mockImplementation(callback => callback(prismaMock)),
        order: {
            findUnique: jest.fn(),
            create: jest.fn()
        },
        customer: {
            findUnique: jest.fn()
        },
        item: {
            findUnique: jest.fn(),
            update: jest.fn()
        },
        orderItems: {
            create: jest.fn()
        }
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CreateOrderListener,
                {
                    provide: PrismaService,
                    useValue: prismaMock
                }
            ]
        }).compile()

        service = module.get<CreateOrderListener>(CreateOrderListener)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('test createOrderListener', () => {
        it('should throw an error if order already exists', async () => {
            const orderId = faker.string.uuid()
            const createOrderInput = {
                id: orderId,
                customerId: faker.string.uuid(),
                orderItems: [
                    {id: faker.string.uuid(), quantity: faker.number.int({min: 1, max: 10})}
                ]
            }

            prismaMock.order.findUnique.mockResolvedValue(orderId)

            await expect(service.handle(createOrderInput)).rejects.toThrow()
        })

        it('should throw an error if customer not found', async () => {
            const customerId = faker.string.uuid()
            const createOrderInput = {
                id: faker.string.uuid(),
                customerId: customerId,
                orderItems: [
                    {id: faker.string.uuid(), quantity: faker.number.int({min: 1, max: 10})}
                ]
            }

            prismaMock.order.findUnique.mockResolvedValue(null)
            prismaMock.customer.findUnique.mockResolvedValue(null)

            await expect(service.handle(createOrderInput)).rejects.toThrow()
        })

        it('should throw an error if item does not exist', async () => {
            const customerId = faker.string.uuid()
            const createOrderInput = {
                id: faker.string.uuid(),
                customerId: customerId,
                orderItems: [
                    {id: faker.string.uuid(), quantity: faker.number.int({min: 1, max: 10})}
                ]
            }

            prismaMock.order.findUnique.mockResolvedValue(null)
            prismaMock.customer.findUnique.mockResolvedValue(customerId)
            prismaMock.item.findUnique.mockResolvedValue(null)

            await expect(service.handle(createOrderInput)).rejects.toThrow()
        })

        it('should throw an error if item quantity is grater than stock', async () => {
            const customerId = faker.string.uuid()
            const itemId = faker.string.uuid()
            const createOrderInput = {
                id: itemId,
                customerId: customerId,
                orderItems: [{id: faker.string.uuid(), quantity: 2}]
            }

            prismaMock.order.findUnique.mockResolvedValue(null)
            prismaMock.customer.findUnique.mockResolvedValue(customerId)
            prismaMock.item.findUnique.mockResolvedValue({id: itemId, quantity: 1})

            await expect(service.handle(createOrderInput)).rejects.toThrow()
        })

        it('should create an order', async () => {
            const customerId = faker.string.uuid()
            const itemId = faker.string.uuid()
            const createOrderInput = {
                id: itemId,
                customerId: customerId,
                orderItems: [{id: faker.string.uuid(), quantity: 5}]
            }

            prismaMock.order.findUnique.mockResolvedValue(null)
            prismaMock.customer.findUnique.mockResolvedValue(customerId)
            prismaMock.item.findUnique.mockResolvedValue({id: itemId, quantity: 10})
            prismaMock.item.update.mockResolvedValue({quantity: 5})
            prismaMock.order.create.mockResolvedValue({id: faker.string.uuid(), customerId})
            prismaMock.orderItems.create.mockResolvedValue({id: faker.string.uuid()})

            await service.handle(createOrderInput)

            expect(prismaMock.order.create).toHaveBeenCalledTimes(1)
            expect(prismaMock.orderItems.create).toHaveBeenCalledTimes(1)
        })
    })
})
