import {ApiProperty} from '@nestjs/swagger'
import {OrderStatus} from '@prisma/client'
import {IsNotEmpty} from 'class-validator'

export class UpdateOrderDto {
    @IsNotEmpty()
    @ApiProperty({
        description: 'Status do pedido',
        example: OrderStatus.APPROVED,
        required: true,
        type: String
    })
    orderStatus: OrderStatus
}
