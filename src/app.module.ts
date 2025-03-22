import {Module} from '@nestjs/common'
import {AppController} from './app.controller'
import {AppService} from './app.service'
import {CustomersModule} from './customers/customers.module'
import {AuthModule} from './auth/auth.module'
import {OrdersModule} from './orders/orders.module'
import {ItemsModule} from './items/items.module'
import {SqsModule} from './sqs/sqs.module'
import {ConsumerService} from './sqs/consumer.service'

@Module({
    imports: [CustomersModule, AuthModule, OrdersModule, ItemsModule, SqsModule],
    controllers: [AppController],
    providers: [AppService, ConsumerService]
})
export class AppModule {}
