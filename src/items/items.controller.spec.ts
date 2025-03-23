import {Test} from '@nestjs/testing'
import {ItemsController} from './items.controller'
import {ItemsService} from './items.service'
import {Item} from '@prisma/client'
import {faker} from '@faker-js/faker/locale/pt_BR'
import {PrismaService} from '../prisma.service'
import {CreateItemDto} from './dto/create-item.dto'
import {UpdateItemDto} from './dto/update-item.dto'
describe('ItemsController', () => {
    const itemObject: Item = {
        id: faker.string.uuid(),
        createdAt: new Date(),
        updatedAt: new Date(),
        name: faker.commerce.productName(),
        price: 100,
        quantity: 10
    }

    let itemsController: ItemsController
    let itemsService: ItemsService

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [ItemsController],
            providers: [
                PrismaService,
                {
                    provide: ItemsService,
                    useValue: {
                        findAll: jest
                            .fn<Promise<Item[]>, []>()
                            .mockImplementation(async () => [itemObject]),
                        create: jest
                            .fn<Promise<Item>, [CreateItemDto]>()
                            .mockImplementation(async () => itemObject),
                        getById: jest
                            .fn<Promise<Item | null>, [string]>()
                            .mockImplementation(async () => itemObject),
                        findOrdersByCustomerId: jest
                            .fn<Promise<Item[]>, []>()
                            .mockImplementation(async () => [itemObject]),
                        update: jest
                            .fn<Promise<Item>, [string, UpdateItemDto]>()
                            .mockImplementation(async () => itemObject),
                        remove: jest
                            .fn<Promise<boolean>, [string]>()
                            .mockImplementation(async () => true)
                    }
                }
            ]
        }).compile()

        itemsService = moduleRef.get(ItemsService)
        itemsController = moduleRef.get(ItemsController)
    })

    describe('createItem', () => {
        it('should return an item', async () => {
            const result = itemObject

            const itemToCreate = {
                name: faker.commerce.productName(),
                price: 100,
                quantity: 10
            }
            expect(await itemsController.create(itemToCreate)).toStrictEqual(result)
        })
    })

    describe('findAll', () => {
        it('should return an array of items', async () => {
            const result: Item[] = [itemObject]

            expect(await itemsController.findAll()).toStrictEqual(result)
        })
    })

    describe('getById', () => {
        it('should return an item', async () => {
            const result: Item = itemObject

            expect(await itemsController.getById('1')).toStrictEqual(result)
        })
    })

    describe('updateItem', () => {
        it('should return an item', async () => {
            const result: Item = itemObject

            expect(
                await itemsController.update('1', {
                    name: faker.commerce.productName(),
                    price: 100,
                    quantity: 10
                })
            ).toStrictEqual(result)
        })
    })

    describe('removeItem', () => {
        it('should return a boolean', async () => {
            const result = true

            expect(await itemsController.remove('1')).toStrictEqual(result)
        })
    })
})
