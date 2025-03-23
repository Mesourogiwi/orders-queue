import * as request from 'supertest'
import {Test} from '@nestjs/testing'
import {OrdersModule} from '../src/orders/orders.module'
import {OrdersService} from '../src/orders/orders.service'
import {INestApplication} from '@nestjs/common'
import {Order, OrderStatus} from '@prisma/client'
import {faker} from '@faker-js/faker/locale/pt_BR'
import {CreateOrderDto} from '../src/orders/dto/create-order.dto'

describe('Orders e2e', () => {
    const orderResponseObject: Order = {
        createdAt: new Date(),
        id: faker.string.uuid(),
        orderStatus: OrderStatus.APPROVED,
        totalAmount: 100,
        updatedAt: new Date(),
        customerId: faker.string.uuid()
    }
    let app: INestApplication
    let ordersService = {
        findAll: () => [orderResponseObject],
        createOrder: () => ({
            message: 'Pedido enviado para a fila com sucesso!'
        }),
        getOrderById: () => orderResponseObject,
        findOrdersByCustomerId: () => [orderResponseObject],
        updateOrderStatus: () => orderResponseObject
    }

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [OrdersModule]
        })
            .overrideProvider(OrdersService)
            .useValue(ordersService)
            .compile()

        app = moduleRef.createNestApplication()
        await app.init()
    })

    it(`/GET orders`, () => {
        return request(app.getHttpServer())
            .get('/orders')
            .expect(200)
            .then(res => {
                expect(res.body).toEqual([
                    {
                        ...orderResponseObject,
                        createdAt: orderResponseObject.createdAt.toISOString(),
                        updatedAt: orderResponseObject.updatedAt.toISOString()
                    }
                ])
            })
    })

    it(`/POST orders`, () => {
        const dataToSend: CreateOrderDto = {
            customerId: faker.string.uuid(),
            orderItems: [
                {
                    id: faker.string.uuid(),
                    quantity: faker.number.int({min: 1, max: 10})
                }
            ],
            id: faker.string.uuid()
        }

        return request(app.getHttpServer())
            .post('/orders')
            .send(dataToSend)
            .expect(201)
            .then(res => {
                expect(res.body).toEqual({
                    message: 'Pedido enviado para a fila com sucesso!'
                })
            })
    })

    it(`/GET orders/:id`, () => {
        return request(app.getHttpServer())
            .get(`/orders/getById/${orderResponseObject.id}`)
            .expect(200)
            .then(res => {
                expect(res.body).toEqual({
                    ...orderResponseObject,
                    createdAt: orderResponseObject.createdAt.toISOString(),
                    updatedAt: orderResponseObject.updatedAt.toISOString()
                })
            })
    })

    it('/GET orders/:customerid', () => {
        return request(app.getHttpServer())
            .get(`/orders/getByCustomerId/${orderResponseObject.customerId}`)
            .expect(200)
            .then(res => {
                expect(res.body).toEqual([
                    {
                        ...orderResponseObject,
                        createdAt: orderResponseObject.createdAt.toISOString(),
                        updatedAt: orderResponseObject.updatedAt.toISOString()
                    }
                ])
            })
    })

    it('/PATCH orders/:id', () => {
        return request(app.getHttpServer())
            .patch(`/orders/${orderResponseObject.id}`)
            .send({
                orderStatus: OrderStatus.APPROVED
            })
            .expect(200)
            .then(res => {
                expect(res.body).toEqual({
                    ...orderResponseObject,
                    createdAt: orderResponseObject.createdAt.toISOString(),
                    updatedAt: orderResponseObject.updatedAt.toISOString()
                })
            })
    })

    afterAll(async () => {
        await app.close()
    })
})
