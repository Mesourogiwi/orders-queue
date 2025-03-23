import {Injectable, Logger} from '@nestjs/common'
import {PrismaService} from '../../prisma.service'
import {CreateOrderDto} from '../dto/create-order.dto'
import {Order, OrderStatus} from '@prisma/client'

type messageData = CreateOrderDto & {
    totalAmount: number
}
@Injectable()
export class CreateOrderListener {
    constructor(private readonly prisma: PrismaService) {}
    async handle(data: messageData) {
        Logger.log('Handling message create order', data)
        let order: Order | null = null

        await this.prisma.$transaction(async tx => {
            order = await tx.order.create({
                data: {
                    id: data.id,
                    customerId: data.customerId,
                    totalAmount: data.totalAmount,
                    orderStatus: OrderStatus.PENDING_PAYMENT
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
