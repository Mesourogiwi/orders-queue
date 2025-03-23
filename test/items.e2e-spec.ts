import * as request from 'supertest'
import {Test} from '@nestjs/testing'
import {ItemsModule} from '../src/items/items.module'
import {ItemsService} from '../src/items/items.service'
import {INestApplication} from '@nestjs/common'
import {faker} from '@faker-js/faker/locale/pt_BR'
import {CreateItemDto} from '../src/items/dto/create-item.dto'
import {UpdateItemDto} from '../src/items/dto/update-item.dto'
import {Item} from '@prisma/client'

describe('Customers e2e', () => {
    const itemResponseObject: Item = {
        createdAt: new Date(),
        updatedAt: new Date(),
        id: faker.string.uuid(),
        name: 'Notebook',
        price: 100,
        quantity: 10
    }
    let app: INestApplication
    let ordersService = {
        findAll: () => [itemResponseObject],
        create: () => itemResponseObject,
        getById: () => itemResponseObject,
        update: () => ({...itemResponseObject, name: 'Computador'}),
        remove: () => true
    }

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [ItemsModule]
        })
            .overrideProvider(ItemsService)
            .useValue(ordersService)
            .compile()

        app = moduleRef.createNestApplication()
        await app.init()
    })

    it(`/GET items`, () => {
        return request(app.getHttpServer())
            .get('/items')
            .expect(200)
            .then(res => {
                expect(res.body).toEqual([
                    {
                        ...itemResponseObject,
                        createdAt: itemResponseObject.createdAt.toISOString(),
                        updatedAt: itemResponseObject.updatedAt.toISOString()
                    }
                ])
            })
    })

    it(`/POST items`, () => {
        const dataToSend: CreateItemDto = {
            name: 'Notebook',
            price: 100,
            quantity: 10
        }

        return request(app.getHttpServer())
            .post('/items')
            .send(dataToSend)
            .expect(201)
            .then(res => {
                expect(res.body).toEqual({
                    ...itemResponseObject,
                    createdAt: itemResponseObject.createdAt.toISOString(),
                    updatedAt: itemResponseObject.updatedAt.toISOString()
                })
            })
    })

    it(`/GET /:id`, () => {
        return request(app.getHttpServer())
            .get(`/items/${itemResponseObject.id}`)
            .expect(200)
            .then(res => {
                expect(res.body).toEqual({
                    ...itemResponseObject,
                    createdAt: itemResponseObject.createdAt.toISOString(),
                    updatedAt: itemResponseObject.updatedAt.toISOString()
                })
            })
    })

    it('/PATCH items/:id', () => {
        const dataToSend: UpdateItemDto = {
            name: 'Computador'
        }
        return request(app.getHttpServer())
            .patch(`/items/${itemResponseObject.id}`)
            .send(dataToSend)
            .expect(200)
            .then(res => {
                expect(res.body).toEqual({
                    ...itemResponseObject,
                    name: 'Computador',
                    createdAt: itemResponseObject.createdAt.toISOString(),
                    updatedAt: itemResponseObject.updatedAt.toISOString()
                })
            })
    })

    it('/DELETE items/:id', () => {
        return request(app.getHttpServer()).delete(`/items/${itemResponseObject.id}`).expect(200)
    })

    afterAll(async () => {
        await app.close()
    })
})
