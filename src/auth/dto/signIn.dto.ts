import {IsNotEmpty} from 'class-validator'

export class SignInDto {
    @IsNotEmpty()
    cpf: string

    @IsNotEmpty()
    password: string
}
