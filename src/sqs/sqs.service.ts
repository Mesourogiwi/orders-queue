// sqs.service.ts
import {Inject, Injectable} from '@nestjs/common'
import {
    SQSClient,
    SendMessageCommand,
    ReceiveMessageCommand,
    DeleteMessageCommand
} from '@aws-sdk/client-sqs'

@Injectable()
export class SqsService {
    constructor(@Inject('SQS_CLIENT') private readonly sqsClient: SQSClient) {}

    private readonly queueUrl = process.env.SQS_QUEUE_URL

    async sendMessage(messageBody: any): Promise<void> {
        const command = new SendMessageCommand({
            QueueUrl: this.queueUrl,
            MessageBody: JSON.stringify(messageBody)
        })
        await this.sqsClient.send(command)
    }

    async receiveMessages(): Promise<any[]> {
        const command = new ReceiveMessageCommand({
            QueueUrl: this.queueUrl,
            MaxNumberOfMessages: 10,
            WaitTimeSeconds: 10
        })
        const response = await this.sqsClient.send(command)
        return response.Messages || []
    }

    async deleteMessage(receiptHandle: string): Promise<void> {
        const command = new DeleteMessageCommand({
            QueueUrl: this.queueUrl,
            ReceiptHandle: receiptHandle
        })
        await this.sqsClient.send(command)
    }
}
