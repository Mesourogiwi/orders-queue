import {Module} from '@nestjs/common'
import {AuthService} from './auth.service'
import {CustomersModule} from '../customers/customers.module'
import {JwtModule} from '@nestjs/jwt'
import {AuthController} from './auth.controller'
import {jwtConstants} from './constants'
import {CustomersService} from '../customers/customers.service'
import {PrismaService} from '../prisma.service'

@Module({
    imports: [
        CustomersModule,
        JwtModule.register({
            global: true,
            secret: jwtConstants.secret,
            signOptions: {expiresIn: jwtConstants.tokenExpirationTime}
        })
    ],
    providers: [AuthService, CustomersService, PrismaService],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule {}
