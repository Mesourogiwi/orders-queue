import {Injectable} from '@nestjs/common'
import {PrismaService} from '../../prisma.service'
import {CreateOrderDto} from '../dto/create-order.dto'
import {Order} from '@prisma/client'

@Injectable()
export class CreateOrderListener {
    constructor(private readonly prisma: PrismaService) {}
    async handle(data: CreateOrderDto) {
        const existingOrder = await this.prisma.order.findUnique({where: {id: data.id}})

        if (existingOrder) {
            throw new Error('Order already exists')
        }

        const customer = await this.prisma.customer.findUnique({where: {id: data.customerId}})

        if (!customer) {
            throw new Error('Customer not found')
        }

        let totalAmount = 0

        for (const item of data.orderItems) {
            const existingItem = await this.prisma.item.findUnique({where: {id: item.id}})

            if (!existingItem) {
                throw new Error('Item not found')
            }

            if (existingItem.quantity < item.quantity) {
                throw new Error('Insufficient quantity of item')
            }

            totalAmount += existingItem.price * item.quantity
        }

        let order: Order | null = null

        await this.prisma.$transaction(async tx => {
            order = await tx.order.create({
                data: {
                    id: data.id,
                    customerId: data.customerId,
                    totalAmount
                }
            })

            for (const item of data.orderItems) {
                await tx.orderItems.create({
                    data: {
                        orderId: data.id,
                        itemId: item.id,
                        itemQuantity: item.quantity
                    }
                })
                await tx.item.update({
                    where: {
                        id: item.id
                    },
                    data: {
                        quantity: {
                            decrement: item.quantity
                        }
                    }
                })
            }
        })

        return order
    }
}
