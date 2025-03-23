import {BadRequestException, Injectable} from '@nestjs/common'
import {CreateOrderDto} from './dto/create-order.dto'
import {PrismaService} from '../prisma.service'
import {SqsService} from '../sqs/sqs.service'
import {Order} from '@prisma/client'
import {UpdateOrderDto} from './dto/update-order.dto'

@Injectable()
export class OrdersService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly sqsService: SqsService
    ) {}
    async createOrder(createOrderDto: CreateOrderDto) {
        const existingOrder = await this.prisma.order.findUnique({where: {id: createOrderDto.id}})

        if (existingOrder) {
            throw new BadRequestException('Order already exists', {
                cause: new Error('Order already exists'),
                description: `Pedido com id ${createOrderDto.id} já existe na base.`
            })
        }

        const customer = await this.prisma.customer.findUnique({
            where: {id: createOrderDto.customerId}
        })

        if (!customer) {
            throw new BadRequestException('Customer not found', {
                cause: new Error('Customer not found'),
                description: `Usuário com id ${createOrderDto.customerId} não foi encontrado na base.`
            })
        }

        let totalAmount = 0

        for (const item of createOrderDto.orderItems) {
            const existingItem = await this.prisma.item.findUnique({where: {id: item.id}})

            if (!existingItem) {
                throw new BadRequestException('Item not found', {
                    cause: new Error('Item not found'),
                    description: `Item com id ${item.id} não foi encontrado na base.`
                })
            }

            if (existingItem.quantity < item.quantity) {
                throw new BadRequestException('Not enough stock', {
                    cause: new Error('Not enough stock'),
                    description: `Quantidade insuficiente no estoque.`
                })
            }

            totalAmount += existingItem.price * item.quantity
        }

        const payload = {
            eventName: 'order.created',
            data: {...createOrderDto, totalAmount},
            timestamp: new Date().toISOString()
        }

        await this.sqsService.sendMessage(payload)
        return {
            message: 'Pedido enviado para a fila com sucesso!'
        }
    }

    async findAll(): Promise<Order[]> {
        return await this.prisma.order.findMany({
            include: {
                orderItems: {
                    include: {
                        item: true
                    }
                }
            }
        })
    }

    async getOrderById(id: string): Promise<Order | null> {
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

    async findOrdersByCustomerId(customerId: string): Promise<Order[]> {
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
