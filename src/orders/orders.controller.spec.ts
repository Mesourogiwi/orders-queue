import {Test} from '@nestjs/testing'
import {OrdersController} from './orders.controller'
import {OrdersService} from './orders.service'
import {Order, OrderStatus} from '@prisma/client'
import {faker} from '@faker-js/faker/locale/pt_BR'
import {PrismaService} from '../prisma.service'
import {SqsService} from '../sqs/sqs.service'
import {UpdateOrderDto} from './dto/update-order.dto'
import {CreateOrderDto} from './dto/create-order.dto'
describe('OrdersController', () => {
    const orderObject: Order = {
        id: faker.string.uuid(),
        customerId: faker.string.uuid(),
        createdAt: new Date(),
        updatedAt: new Date(),
        orderStatus: OrderStatus.APPROVED,
        totalAmount: 100
    }

    const sqsMock = {
        sendMessage: jest.fn()
    }

    let ordersController: OrdersController
    let ordersService: OrdersService

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [OrdersController],
            providers: [
                PrismaService,
                {
                    provide: SqsService,
                    useValue: sqsMock
                },
                {
                    provide: OrdersService,
                    useValue: {
                        findAll: jest
                            .fn<Promise<Order[]>, []>()
                            .mockImplementation(async () => [orderObject]),
                        createOrder: jest
                            .fn<Promise<{message: string}>, [CreateOrderDto]>()
                            .mockImplementation(async () => ({
                                message: 'Pedido enviado para a fila com sucesso!'
                            })),
                        getOrderById: jest
                            .fn<Promise<Order | null>, [string]>()
                            .mockImplementation(async () => orderObject),
                        findOrdersByCustomerId: jest
                            .fn<Promise<Order[]>, []>()
                            .mockImplementation(async () => [orderObject]),
                        updateOrderStatus: jest
                            .fn<Promise<Order>, [string, UpdateOrderDto]>()
                            .mockImplementation(async () => orderObject)
                    }
                }
            ]
        }).compile()

        ordersService = moduleRef.get(OrdersService)
        ordersController = moduleRef.get(OrdersController)
    })

    describe('createOrder', () => {
        it('should return a message', async () => {
            const result = {
                message: 'Pedido enviado para a fila com sucesso!'
            }

            const orderToCreate = {
                id: faker.string.uuid(),
                customerId: faker.string.uuid(),
                orderItems: [
                    {
                        id: faker.string.uuid(),
                        quantity: 1,
                        item: {
                            id: faker.string.uuid(),
                            name: faker.commerce.productName(),
                            price: 100
                        }
                    }
                ]
            }
            expect(await ordersController.createOrder(orderToCreate)).toStrictEqual(result)
        })
    })

    describe('findAll', () => {
        it('should return an array of orders', async () => {
            const result: Order[] = [orderObject]

            expect(await ordersController.findAll()).toStrictEqual(result)
        })
    })

    describe('getOrderById', () => {
        it('should return an order', async () => {
            const result: Order = orderObject

            expect(await ordersController.getOrderById('1')).toStrictEqual(result)
        })
    })

    describe('getOrdesrByCustomerId', () => {
        it('should return an array of orders', async () => {
            const result: Order[] = [orderObject]

            expect(await ordersController.findOrdersByCustomerId('1')).toStrictEqual(result)
        })
    })

    describe('updateOrder', () => {
        it('should return an order', async () => {
            const result: Order = orderObject

            expect(
                await ordersController.updateOrderStatus('1', {
                    orderStatus: OrderStatus.APPROVED
                })
            ).toStrictEqual(result)
        })
    })
})
