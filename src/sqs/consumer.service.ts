// consumer.service.ts
import {Injectable, OnModuleInit} from '@nestjs/common'
import {SqsService} from './sqs.service'

@Injectable()
export class ConsumerService implements OnModuleInit {
    constructor(private readonly sqsService: SqsService) {}

    async onModuleInit() {
        this.pollMessages()
    }

    private async pollMessages() {
        while (true) {
            const messages = await this.sqsService.receiveMessages()
            for (const msg of messages) {
                try {
                    const payload = JSON.parse(msg.Body)
                    // Aqui você processa o payload
                    console.log('Mensagem recebida:', payload)

                    // Após o processamento com sucesso
                    await this.sqsService.deleteMessage(msg.ReceiptHandle)
                } catch (err) {
                    console.error('Erro ao processar mensagem:', err)
                }
            }
        }
    }
}
