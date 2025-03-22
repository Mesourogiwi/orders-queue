import {Module} from '@nestjs/common'
import {OrdersService} from './orders.service'
import {OrdersController} from './orders.controller'
import {PrismaService} from '../prisma.service'
import {SqsService} from '../sqs/sqs.service'
import {SqsModule} from '../sqs/sqs.module'

@Module({
    imports: [SqsModule],
    controllers: [OrdersController],
    providers: [OrdersService, PrismaService, SqsService]
})
export class OrdersModule {}
