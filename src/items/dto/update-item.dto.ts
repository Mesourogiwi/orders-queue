import {PartialType} from '@nestjs/mapped-types'
import {IsAlphanumeric, IsNumber, IsOptional} from 'class-validator'
import {CreateItemDto} from './create-item.dto'

export class UpdateItemDto extends PartialType(CreateItemDto) {
    @IsAlphanumeric()
    @IsOptional()
    name: string

    @IsNumber()
    @IsOptional()
    price: number

    @IsNumber()
    @IsOptional()
    quantity: number
}
