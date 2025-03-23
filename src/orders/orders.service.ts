import {Injectable} from '@nestjs/common'
import {CreateOrderDto} from './dto/create-order.dto'
import {PrismaService} from '../prisma.service'
import {SqsService} from '../sqs/sqs.service'

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
}
