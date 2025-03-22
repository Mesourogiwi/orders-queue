import {Module} from '@nestjs/common'
import {SQSClient} from '@aws-sdk/client-sqs'
import {SqsService} from './sqs.service'
import {SQSConstants} from './sqs.constants'

@Module({
    providers: [
        {
            provide: 'SQS_CLIENT',
            useFactory: () => {
                return new SQSClient({
                    region: SQSConstants.region,
                    credentials: {
                        accessKeyId: SQSConstants.accessKeyId,
                        secretAccessKey: SQSConstants.secretAccessKey
                    }
                })
            }
        },
        SqsService
    ],
    exports: ['SQS_CLIENT', SqsService]
})
export class SqsModule {}
