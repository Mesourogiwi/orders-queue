import {ApiProperty} from '@nestjs/swagger'
import {IsAlpha, IsEmail, IsNotEmpty} from 'class-validator'

export class CreateCustomerDto {
    @IsEmail()
    @ApiProperty({
        description: 'E-mail do cliente',
        example: 'lucas.honorato.dev@gmail.com',
        required: true,
        type: String
    })
    email: string

    @IsNotEmpty()
    @IsAlpha()
    @ApiProperty({
        description: 'Nome do cliente',
        example: 'Lucas Quintas Honorato',
        required: true,
        type: String
    })
    name: string

    @IsNotEmpty()
    @ApiProperty({
        description: 'CPF do cliente',
        example: '243.771.463-43',
        required: true,
        type: String
    })
    cpf: string

    @IsNotEmpty()
    @ApiProperty({
        description: 'Senha do cliente',
        example: 'Senha123!',
        required: true,
        type: String
    })
    password: string
}
