import {Injectable, UnauthorizedException} from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import {JwtService} from '@nestjs/jwt'
import {PrismaService} from '../prisma.service'
import {Customer} from '@prisma/client'
import {SignInDto} from './dto/signIn.dto'

type signInResponse = {
    accessToken: string
    customer: Omit<Customer, 'password' | 'createdAt' | 'updatedAt'>
}
@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService
    ) {}

    async signIn(signInInput: SignInDto): Promise<signInResponse> {
        const {cpf, password} = signInInput
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
