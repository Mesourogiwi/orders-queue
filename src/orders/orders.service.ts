import {BadRequestException, Injectable} from '@nestjs/common'
import {CreateOrderDto} from './dto/create-order.dto'
import {PrismaService} from '../prisma.service'
import {SqsService} from '../sqs/sqs.service'
import {Order, OrderStatus} from '@prisma/client'
import {UpdateOrderDto} from './dto/update-order.dto copy'

@Injectable()
export class OrdersService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly sqsService: SqsService
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
    }

    async findAll() {
        return await this.prisma.order.findMany({
            include: {
                orderItems: true
            }
        })
    }

    async getOrderById(id: string) {
        return await this.prisma.order.findUnique({
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

    async findOrdersByCustomerId(customerId: string) {
        return await this.prisma.order.findMany({
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

    async updateOrderStatus(id: string, data: UpdateOrderDto): Promise<Order> {
        const order = await this.prisma.order.findUnique({where: {id}})

        if (!order) {
            throw new BadRequestException('Item not found', {
                cause: new Error('Item not found'),
                description: `Item com id ${id} não encontado`
            })
        }

        const updatedOrder = await this.prisma.order.update({
            where: {
                id
            },
            data: {
                orderStatus: data.orderStatus
            }
        })

        return updatedOrder
    }
}
