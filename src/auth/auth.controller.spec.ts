import {Test} from '@nestjs/testing'
import {Roles} from '@prisma/client'
import {faker} from '@faker-js/faker/locale/pt_BR'
import {PrismaService} from '../prisma.service'
import {SignInDto} from './dto/signIn.dto'
import {AuthController} from './auth.controller'
import {AuthService, signInResponse} from './auth.service'
import {JwtService} from '@nestjs/jwt'
describe('AuthController', () => {
    const signInResponse: signInResponse = {
        accessToken: faker.string.uuid(),
        customer: {
            id: faker.string.uuid(),
            name: faker.person.firstName(),
            email: faker.internet.email(),
            cpf: faker.string.numeric(11),
            role: Roles.CUSTOMER
        }
    }

    let authController: AuthController
    let authService: AuthService

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                PrismaService,
                JwtService,
                {
                    provide: AuthService,
                    useValue: {
                        signIn: jest
                            .fn<Promise<signInResponse>, [SignInDto]>()
                            .mockImplementation(async () => signInResponse)
                    }
                }
            ]
        }).compile()

        authService = moduleRef.get(AuthService)
        authController = moduleRef.get(AuthController)
    })

    describe('signIn', () => {
        it('should return a signInResponse', async () => {
            const result = signInResponse

            const signInParams: SignInDto = {
                cpf: faker.string.numeric(11),
                password: faker.internet.password()
            }
            expect(await authController.signIn(signInParams)).toStrictEqual(result)
        })
    })
})
