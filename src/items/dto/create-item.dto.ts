import {ApiProperty} from '@nestjs/swagger'
import {IsAlphanumeric, IsNotEmpty, IsNumber} from 'class-validator'

export class CreateItemDto {
    @IsNotEmpty()
    @IsAlphanumeric()
    @ApiProperty({
        description: 'Nome do item',
        example: 'Notebook',
        required: true,
        type: String
    })
    name: string

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({
        description: 'Preço do item',
        example: 1234.56,
        required: true,
        type: Number
    })
    price: number

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({
        description: 'Quantidade em estoque do item',
        example: 10,
        required: true,
        type: Number
    })
    quantity: number
}
