import {ApiProperty} from '@nestjs/swagger'
import {IsNotEmpty} from 'class-validator'

type OrderItems = {id: string; quantity: number}
export class CreateOrderDto {
    @IsNotEmpty()
    @ApiProperty({
        description: 'ID do pedido',
        example: '123',
        required: true,
        type: String
    })
    id: string

    @IsNotEmpty()
    orderItems: OrderItems[]

    @IsNotEmpty()
    customerId: string
}
