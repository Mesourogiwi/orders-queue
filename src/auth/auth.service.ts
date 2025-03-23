import {Injectable, UnauthorizedException} from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import {JwtService} from '@nestjs/jwt'
import {PrismaService} from '../prisma.service'
import {Customer} from '@prisma/client'

type signInParams = {
    cpf: string
    password: string
}

type signInResponse = {
    accessToken: string
    customer: Omit<Customer, 'password'>
}
@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService
    ) {}

    async signIn(params: signInParams): Promise<signInResponse> {
        const {cpf, password} = params
        const customer = await this.prisma.customer.findUnique({where: {cpf}})

        const isPasswordValid = customer && (await bcrypt.compare(password, customer.password))

        if (!isPasswordValid || !customer) {
            throw new UnauthorizedException('Invalid credentials', {
                cause: new Error('Invalid credentials'),
                description: 'Usuário ou senha inválidos'
            })
        }
        const payload = {id: customer.id, sub: customer.id}

        const accessToken = this.jwtService.sign(payload)

        return {
            customer: {
                id: customer.id,
                name: customer.name,
                email: customer.email,
                cpf: customer.cpf
            },
            accessToken
        }
    }
}
