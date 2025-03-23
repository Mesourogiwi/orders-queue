import * as request from 'supertest'
import {Test} from '@nestjs/testing'
import {CustomersModule} from '../src/customers/customers.module'
import {CustomersService} from '../src/customers/customers.service'
import {INestApplication} from '@nestjs/common'
import {Customer, Roles} from '@prisma/client'
import {faker} from '@faker-js/faker/locale/pt_BR'
import {CreateCustomerDto} from '../src/customers/dto/create-customer.dto'
import {UpdateCustomerDto} from '../src/customers/dto/update-customer.dto'

describe('Customers e2e', () => {
    const customerResponseObject: Customer = {
        createdAt: new Date(),
        updatedAt: new Date(),
        id: faker.string.uuid(),
        cpf: '243.771.463-43',
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
        role: Roles.CUSTOMER
    }
    const accessToken = faker.string.uuid()
    let app: INestApplication
    let customersService = {
        findAll: () => [customerResponseObject],
        createCustomer: () => ({
            ...customerResponseObject,
            accessToken,
            password: undefined
        }),
        getById: () => customerResponseObject,
        getByCpf: () => customerResponseObject,
        findOrdersByCustomerId: () => [customerResponseObject],
        update: () => ({...customerResponseObject, password: undefined}),
        remove: () => true
    }

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [CustomersModule]
        })
            .overrideProvider(CustomersService)
            .useValue(customersService)
            .compile()

        app = moduleRef.createNestApplication()
        await app.init()
    })

    it(`/GET customers`, () => {
        return request(app.getHttpServer())
            .get('/customers')
            .expect(200)
            .then(res => {
                expect(res.body).toEqual([
                    {
                        ...customerResponseObject,
                        createdAt: customerResponseObject.createdAt.toISOString(),
                        updatedAt: customerResponseObject.updatedAt.toISOString()
                    }
                ])
            })
    })

    it(`/POST customers`, () => {
        const dataToSend: CreateCustomerDto = {
            cpf: '243.771.463-43',
            email: faker.internet.email(),
            name: faker.person.fullName(),
            password: faker.internet.password()
        }

        return request(app.getHttpServer())
            .post('/customers')
            .send(dataToSend)
            .expect(201)
            .then(res => {
                expect(res.body).toEqual({
                    ...customerResponseObject,
                    createdAt: customerResponseObject.createdAt.toISOString(),
                    updatedAt: customerResponseObject.updatedAt.toISOString(),
                    accessToken,
                    password: undefined
                })
            })
    })

    it(`/GET getById/:id`, () => {
        return request(app.getHttpServer())
            .get(`/customers/getById/${customerResponseObject.id}`)
            .expect(200)
            .then(res => {
                expect(res.body).toEqual({
                    ...customerResponseObject,
                    createdAt: customerResponseObject.createdAt.toISOString(),
                    updatedAt: customerResponseObject.updatedAt.toISOString()
                })
            })
    })

    it('/GET getByCpf/:cpf', () => {
        return request(app.getHttpServer())
            .get(`/customers/getByCpf/${customerResponseObject.cpf}`)
            .expect(200)
            .then(res => {
                expect(res.body).toEqual({
                    ...customerResponseObject,
                    createdAt: customerResponseObject.createdAt.toISOString(),
                    updatedAt: customerResponseObject.updatedAt.toISOString()
                })
            })
    })

    it('/PATCH customers/:id', () => {
        const dataToSend: UpdateCustomerDto = {
            name: faker.person.fullName()
        }
        return request(app.getHttpServer())
            .patch(`/customers/${customerResponseObject.id}`)
            .send(dataToSend)
            .expect(200)
            .then(res => {
                expect(res.body).toEqual({
                    ...customerResponseObject,
                    createdAt: customerResponseObject.createdAt.toISOString(),
                    updatedAt: customerResponseObject.updatedAt.toISOString(),
                    password: undefined
                })
            })
    })

    it('/DELETE customers/:id', () => {
        return request(app.getHttpServer())
            .delete(`/customers/${customerResponseObject.id}`)
            .expect(200)
    })

    afterAll(async () => {
        await app.close()
    })
})
