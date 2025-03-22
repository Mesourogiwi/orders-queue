import {Module} from '@nestjs/common'
import {AppController} from './app.controller'
import {AppService} from './app.service'
import { CustomersModule } from './customers/customers.module';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { ItemsModule } from './items/items.module';

@Module({
    imports: [CustomersModule, AuthModule, OrdersModule, ItemsModule],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
