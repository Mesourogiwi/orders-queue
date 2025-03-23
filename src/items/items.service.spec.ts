import {Test, TestingModule} from '@nestjs/testing'
import {ItemsService} from './items.service'
import {PrismaService} from '../prisma.service'
import {JwtService} from '@nestjs/jwt'
import {BadRequestException} from '@nestjs/common'
import {faker} from '@faker-js/faker/locale/pt_BR'

describe('CustomersService', () => {
    let service: ItemsService
    const prismaMock = {
        item: {
            findFirst: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        }
    }

    // const jwtMockService = {
    //     sign: jest.fn()
    // }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ItemsService,
                {
                    provide: PrismaService,
                    useValue: prismaMock
                }
                // {
                //     provide: JwtService,
                //     useValue: jwtMockService
                // }
            ]
        }).compile()

        service = module.get<ItemsService>(ItemsService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('test createItem', () => {
        it('should throw error if item price is 0', async () => {
            const createItemInput = {
                name: faker.commerce.productName(),
                price: 0,
                quantity: faker.number.int({min: 1, max: 10})
            }

            await expect(service.create(createItemInput)).rejects.toThrow(BadRequestException)
        })

        it('should throw error if item quantity is 0', async () => {
            const createItemInput = {
                name: faker.commerce.productName(),
                price: Number(faker.commerce.price()),
                quantity: 0
            }

            await expect(service.create(createItemInput)).rejects.toThrow(BadRequestException)
        })

        it('should create an item', async () => {
            const createItemInput = {
                name: faker.commerce.productName(),
                price: Number(faker.commerce.price()),
                quantity: faker.number.int({min: 1, max: 10})
            }

            prismaMock.item.create.mockResolvedValue(createItemInput)

            const item = await service.create(createItemInput)

            expect(item).toBeDefined()
        })
    })

    describe('test findAll items', () => {
        it('should find all items', async () => {
            const mockItems = [{id: faker.string.uuid()}, {id: faker.string.uuid()}]
            prismaMock.item.findMany.mockResolvedValue(mockItems)

            const items = await service.findAll()

            expect(items).toBeDefined()
            expect(items.length).toBeGreaterThan(0)
        })
    })

    describe('test find item by id', () => {
        it('should find a item by id', async () => {
            const itemId = faker.string.uuid()
            const mockItem = {id: itemId}
            prismaMock.item.findUnique.mockResolvedValue(mockItem)

            const item = await service.getById(itemId)

            expect(item).toBeDefined()
            expect(item?.id).toEqual(itemId)
        })
    })

    describe('test update item', () => {
        it('should throw error if item not found', async () => {
            const itemId = faker.string.uuid()
            prismaMock.item.findUnique.mockResolvedValue(null)

            await expect(service.update(itemId, {})).rejects.toThrow(BadRequestException)
        })

        it('should throw error if item price is 0', async () => {
            const updateItemInput = {
                name: faker.commerce.productName(),
                price: 0,
                quantity: faker.number.int({min: 1, max: 10})
            }

            await expect(service.create(updateItemInput)).rejects.toThrow(BadRequestException)
        })

        it('should throw error if item quantity is a negative number', async () => {
            const createItemInput = {
                name: faker.commerce.productName(),
                price: Number(faker.commerce.price()),
                quantity: -1
            }

            await expect(service.create(createItemInput)).rejects.toThrow(BadRequestException)
        })
        it('should update an item', async () => {
            const itemId = faker.string.uuid()
            const data = {
                name: faker.commerce.productName(),
                price: Number(faker.commerce.price()),
                quantity: faker.number.int({min: 1, max: 10})
            }

            prismaMock.item.findUnique.mockResolvedValue({id: itemId})
            prismaMock.item.update.mockResolvedValue({
                name: data.name,
                price: data.price,
                quantity: data.quantity
            })

            const item = await service.update(itemId, data)

            expect(item).toBeDefined()
            expect(item.name).toEqual(data.name)
            expect(item.price).toEqual(data.price)
            expect(item.quantity).toEqual(data.quantity)
        })
    })

    describe('test delete item', () => {
        it('should throw error if item not found', async () => {
            const itemId = faker.string.uuid()
            prismaMock.item.findUnique.mockResolvedValue(null)

            await expect(service.remove(itemId)).rejects.toThrow(BadRequestException)
        })

        it('should delete an item', async () => {
            const itemId = faker.string.uuid()
            prismaMock.item.findUnique.mockResolvedValue({id: itemId})
            const deleted = await service.remove(itemId)

            expect(deleted).toBeTruthy()
        })
    })
})
