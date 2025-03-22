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
