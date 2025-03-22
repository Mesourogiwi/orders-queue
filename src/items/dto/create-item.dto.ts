import {IsAlphanumeric, IsNotEmpty, IsNumber} from 'class-validator'

export class CreateItemDto {
    @IsNotEmpty()
    @IsAlphanumeric()
    name: string

    @IsNotEmpty()
    @IsNumber()
    price: number

    @IsNotEmpty()
    @IsNumber()
    quantity: number
}
