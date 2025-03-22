import {IsNotEmpty} from 'class-validator'

type OrderItems = {id: string; quantity: number}
export class CreateOrderDto {
    @IsNotEmpty()
    id: string

    @IsNotEmpty()
    orderItems: OrderItems[]

    @IsNotEmpty()
    customerId: string
}
