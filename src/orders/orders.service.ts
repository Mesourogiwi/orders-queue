import {Injectable} from '@nestjs/common'
import {CreateOrderDto} from './dto/create-order.dto'
import {PrismaService} from '../prisma.service'
import {Order} from '@prisma/client'
import {SqsService} from '../sqs/sqs.service'

@Injectable()
export class OrdersService {
    constructor(
        private readonly prisma: PrismaService,
        private sqsService: SqsService
    ) {}
    async createOrder(createOrderDto: CreateOrderDto) {
        const payload = {
            eventName: 'order.created',
            data: createOrderDto,
            timestamp: new Date().toISOString()
        }

        await this.sqsService.sendMessage(payload)
        return {
            message: 'Pedido enviado para a fila com sucesso!'
        }
        // const existingOrder = await this.prisma.order.findUnique({where: {id: createOrderDto.id}})

        // if (existingOrder) {
        //     throw new Error('Order already exists')
        // }

        // let totalAmount = 0

        // for (const item of createOrderDto.orderItems) {
        //     const existingItem = await this.prisma.item.findUnique({where: {id: item.id}})

        //     if (!existingItem) {
        //         throw new Error('Item not found')
        //     }

        //     if (existingItem.quantity < item.quantity) {
        //         throw new Error('Insufficient quantity of item')
        //     }

        //     totalAmount += existingItem.price * item.quantity
        // }

        // let order: Order | null = null

        // await this.prisma.$transaction(async tx => {
        //     order = await tx.order.create({
        //         data: {
        //             id: createOrderDto.id,
        //             customerId: createOrderDto.customerId,
        //             totalAmount
        //         }
        //     })

        //     for (const item of createOrderDto.orderItems) {
        //         await tx.orderItems.create({
        //             data: {
        //                 orderId: createOrderDto.id,
        //                 itemId: item.id
        //             }
        //         })
        //         await tx.item.update({
        //             where: {
        //                 id: item.id
        //             },
        //             data: {
        //                 quantity: {
        //                     decrement: item.quantity
        //                 }
        //             }
        //         })
        //     }
        // })

        // return order
    }

    findAll() {
        return this.prisma.orderItems.findMany({
            include: {
                item: true,
                order: true
            }
        })
    }

    getdOrderById(id: string) {
        return this.prisma.order.findUnique({
            include: {
                orderItems: {
                    include: {
                        item: true
                    }
                }
            },
            where: {
                id
            }
        })
    }

    findOrdersByCustomerId(customerId: string) {
        return this.prisma.order.findMany({
            include: {
                orderItems: {
                    include: {
                        item: true
                    }
                }
            },
            where: {
                customerId
            }
        })
    }
}
