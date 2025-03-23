import {Module} from '@nestjs/common'
import {AppController} from './app.controller'
import {AppService} from './app.service'
import {CustomersModule} from './customers/customers.module'
import {AuthModule} from './auth/auth.module'
import {OrdersModule} from './orders/orders.module'
import {ItemsModule} from './items/items.module'
import {SqsModule} from './sqs/sqs.module'
import {ConsumerService} from './sqs/consumer.service'
import {CreateOrderListener} from './orders/listeners/createOrder.listener'
import {PrismaService} from './prisma.service'
import {APP_GUARD} from '@nestjs/core'
import {AuthGuard} from './auth/auth.guard'

@Module({
    imports: [CustomersModule, AuthModule, OrdersModule, ItemsModule, SqsModule],
    controllers: [AppController],
    providers: [
        AppService,
        ConsumerService,
        CreateOrderListener,
        PrismaService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard
        }
    ]
})
export class AppModule {}
