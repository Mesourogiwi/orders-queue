import {Module} from '@nestjs/common'
import {OrdersService} from './orders.service'
import {OrdersController} from './orders.controller'
import {PrismaService} from '../prisma.service'
import {SqsService} from '../sqs/sqs.service'
import {SqsModule} from '../sqs/sqs.module'
import {CreateOrderListener} from './listeners/createOrder.listener'

@Module({
    imports: [SqsModule],
    controllers: [OrdersController],
    providers: [OrdersService, PrismaService, SqsService, CreateOrderListener]
})
export class OrdersModule {}
