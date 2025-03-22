import {IsAlpha, IsEmail, IsNotEmpty} from 'class-validator'

export class CreateCustomerDto {
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsAlpha()
    name: string

    @IsNotEmpty()
    cpf: string

    @IsNotEmpty()
    password: string
}
