import {Injectable, UnauthorizedException} from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import {JwtService} from '@nestjs/jwt'
import {PrismaService} from '../prisma.service'

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private prisma: PrismaService
    ) {}

    async signIn(cpf: string, password: string): Promise<{accessToken: string}> {
        const customer = await this.prisma.customer.findUnique({where: {cpf}})

        const isPasswordValid = customer && (await bcrypt.compare(password, customer.password))

        if (!isPasswordValid) {
            throw new UnauthorizedException()
        }
        const payload = {id: customer.id, sub: customer.id}

        const accessToken = this.jwtService.sign(payload)

        return {
            accessToken
        }
    }
}
