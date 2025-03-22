// consumer.service.ts
import {Injectable, OnModuleInit} from '@nestjs/common'
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
                try {
                    const payload = JSON.parse(msg.Body)

                    if (payload.eventName === 'order.created') {
                        await this.createOrderListener.handle(payload.data)
                    }

                    await this.sqsService.deleteMessage(msg.ReceiptHandle)
                } catch (err) {
                    console.error('Erro ao processar mensagem:', err)
                }
            }
        }
    }
}
