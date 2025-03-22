import {PartialType} from '@nestjs/mapped-types'
import {IsAlphanumeric, IsNumber} from 'class-validator'
import {CreateItemDto} from './create-item.dto'

export class UpdateItemDto extends PartialType(CreateItemDto) {
    @IsAlphanumeric()
    name: string

    @IsNumber()
    price: number

    @IsNumber()
    quantity: number
}
