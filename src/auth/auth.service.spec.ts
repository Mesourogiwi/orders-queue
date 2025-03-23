import {Test, TestingModule} from '@nestjs/testing'
import {AuthService} from './auth.service'
import {PrismaService} from '../prisma.service'
import {JwtService} from '@nestjs/jwt'
import {UnauthorizedException} from '@nestjs/common'
import {faker} from '@faker-js/faker/locale/pt_BR'
import * as bcrypt from 'bcrypt'

describe('AuthService', () => {
    let service: AuthService
    const prismaMock = {
        customer: {
            findUnique: jest.fn()
        }
    }

    const jwtMockService = {
        sign: jest.fn()
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: PrismaService,
                    useValue: prismaMock
                },
                {
                    provide: JwtService,
                    useValue: jwtMockService
                }
            ]
        }).compile()

        service = module.get<AuthService>(AuthService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('test signIn', () => {
        it('should throw error if user not found', async () => {
            const signInInput = {
                cpf: '1234567890',
                password: faker.internet.password()
            }

            await expect(service.signIn(signInInput)).rejects.toThrow(UnauthorizedException)
        })

        it('should return access token if credentials are valid', async () => {
            const customerPassword = faker.internet.password()
            const signInInput = {
                cpf: '1234567890',
                password: await bcrypt.hash(customerPassword, 10)
            }

            const accessToken = 'access_token'

            prismaMock.customer.findUnique = jest.fn().mockResolvedValueOnce(signInInput)
            jwtMockService.sign = jest.fn().mockReturnValueOnce(accessToken)

            const result = await service.signIn({cpf: signInInput.cpf, password: customerPassword})

            expect(result.accessToken).toBeDefined()
            expect(result.customer).toBeDefined()
            expect(result.customer.cpf).toEqual(signInInput.cpf)
        })
    })
})
