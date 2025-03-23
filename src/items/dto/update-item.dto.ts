import {PartialType} from '@nestjs/mapped-types'
import {IsAlphanumeric, IsNumber, IsOptional} from 'class-validator'
import {CreateItemDto} from './create-item.dto'
import {ApiProperty} from '@nestjs/swagger'

export class UpdateItemDto extends PartialType(CreateItemDto) {
    @IsAlphanumeric()
    @IsOptional()
    @ApiProperty({
        description: 'Nome do item',
        example: 'Notebook',
        required: true,
        type: String
    })
    name: string

    @IsNumber()
    @IsOptional()
    @ApiProperty({
        description: 'Preço do item',
        example: 1234.56,
        required: true,
        type: Number
    })
    price: number

    @IsNumber()
    @IsOptional()
    @ApiProperty({
        description: 'Quantidade em estoque do item',
        example: 10,
        required: true,
        type: Number
    })
    quantity: number
}
