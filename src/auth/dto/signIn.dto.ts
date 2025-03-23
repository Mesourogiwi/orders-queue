import {ApiProperty} from '@nestjs/swagger'
import {IsNotEmpty} from 'class-validator'

export class SignInDto {
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
