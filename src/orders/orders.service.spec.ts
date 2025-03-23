import {Test, TestingModule} from '@nestjs/testing'
import {OrdersService} from './orders.service'
import {PrismaService} from '../prisma.service'
import {JwtService} from '@nestjs/jwt'
import {BadRequestException} from '@nestjs/common'
import {faker} from '@faker-js/faker/locale/pt_BR'
import {SqsService} from '../sqs/sqs.service'
import {OrderStatus} from '@prisma/client'

describe('CustomersService', () => {
    let service: OrdersService
    const prismaMock = {
        order: {
            findFirst: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn()
        }
    }

    const sqsMock = {
        sendMessage: jest.fn()
    }

    // const jwtMockService = {
    //     sign: jest.fn()
    // }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OrdersService,
                {
                    provide: PrismaService,
                    useValue: prismaMock
                },
                {
                    provide: SqsService,
                    useValue: sqsMock
                }
                // {
                //     provide: JwtService,
                //     useValue: jwtMockService
                // }
            ]
        }).compile()

        service = module.get<OrdersService>(OrdersService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('test createOrder', () => {
        it('should create an order', async () => {
            const createOrderInput = {
                id: faker.string.uuid(),
                customerId: faker.string.uuid(),
                orderItems: [
                    {id: faker.string.uuid(), quantity: faker.number.int({min: 1, max: 10})}
                ]
            }

            await service.createOrder(createOrderInput)

            expect(sqsMock.sendMessage).toHaveBeenCalledTimes(1)
        })
    })

    describe('test findAll orders', () => {
        it('should find all orders', async () => {
            const mockOrders = [{id: faker.string.uuid()}, {id: faker.string.uuid()}]
            prismaMock.order.findMany.mockResolvedValue(mockOrders)

            const orders = await service.findAll()

            expect(orders).toBeDefined()
            expect(orders.length).toBeGreaterThan(0)
        })
    })

    describe('test find order by id', () => {
        it('should find an order by id', async () => {
            const orderId = faker.string.uuid()
            const mockOrder = {id: orderId}
            prismaMock.order.findUnique.mockResolvedValue(mockOrder)

            const order = await service.getOrderById(orderId)

            expect(order).toBeDefined()
            expect(order?.id).toEqual(orderId)
        })
    })

    describe('test find orders by customer id', () => {
        it('should find orders by customer id', async () => {
            const customerId = faker.string.uuid()
            const mockOrder = [{id: faker.string.uuid(), customerId}]
            prismaMock.order.findMany.mockResolvedValue(mockOrder)

            const order = await service.findOrdersByCustomerId(customerId)

            expect(order).toBeDefined()
            expect(order?.length).toBeGreaterThan(0)
            expect(order?.[0].customerId).toEqual(customerId)
        })
    })

    describe('test update order status', () => {
        it('should throw error if order not found', async () => {
            const orderId = faker.string.uuid()
            prismaMock.order.findUnique.mockResolvedValue(null)

            await expect(
                service.updateOrderStatus(orderId, {orderStatus: OrderStatus.APPROVED})
            ).rejects.toThrow(BadRequestException)
        })

        it('should update order status', async () => {
            const orderId = faker.string.uuid()
            const mockOrder = {id: orderId}
            const updatedOrderMock = {id: orderId, orderStatus: OrderStatus.APPROVED}
            prismaMock.order.findUnique.mockResolvedValue(mockOrder)
            prismaMock.order.update.mockResolvedValue(updatedOrderMock)

            const order = await service.updateOrderStatus(orderId, {
                orderStatus: OrderStatus.APPROVED
            })

            expect(order).toBeDefined()
            expect(prismaMock.order.update).toHaveBeenCalledTimes(1)
            expect(order?.orderStatus).toEqual(OrderStatus.APPROVED)
        })
    })
})
