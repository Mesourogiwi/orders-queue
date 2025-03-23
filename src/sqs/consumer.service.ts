// consumer.service.ts
import {Injectable, Logger, OnModuleInit} from '@nestjs/common'
import {SqsService} from './sqs.service'
import {CreateOrderListener} from '../orders/listeners/createOrder.listener'

@Injectable()
export class ConsumerService implements OnModuleInit {
    constructor(
        private readonly sqsService: SqsService,
        private readonly createOrderListener: CreateOrderListener
    ) {}

    async onModuleInit() {
        this.pollMessages()
    }

    private async pollMessages() {
        while (true) {
            const messages = await this.sqsService.receiveMessages()
            for (const msg of messages) {
                Logger.log('Receiving message', msg)
                try {
                    const payload = JSON.parse(msg.Body)

                    Logger.log('Processing message', payload)

                    if (payload.eventName === 'order.created') {
                        await this.createOrderListener.handle(payload.data)
                    }

                    Logger.log('Message processed', payload)
                    await this.sqsService.deleteMessage(msg.ReceiptHandle)
                } catch (err) {
                    Logger.error('Erro ao processar mensagem:', err)
                }
            }
        }
    }
}
