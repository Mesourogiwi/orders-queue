import {PartialType} from '@nestjs/mapped-types'
import {CreateCustomerDto} from './create-customer.dto'
import {IsAlpha, IsEmail, IsOptional} from 'class-validator'
import {ApiProperty} from '@nestjs/swagger'

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
    @IsOptional()
    @IsEmail()
    @ApiProperty({
        description: 'E-mail do cliente',
        example: 'lucas.honorato.dev@gmail.com',
        required: true,
        type: String
    })
    email?: string

    @IsOptional()
    @IsAlpha()
    @ApiProperty({
        description: 'Nome do cliente',
        example: 'Lucas Quintas Honorato',
        required: true,
        type: String
    })
    name?: string

    @IsOptional()
    @ApiProperty({
        description: 'Senha do cliente',
        example: 'Senha123!',
        required: true,
        type: String
    })
    password?: string
}
