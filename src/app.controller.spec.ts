import {Test, TestingModule} from '@nestjs/testing'
import {AppController} from './app.controller'
import {AppService} from './app.service'

describe('AppController', () => {
    let appController: AppController

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [AppController],
            providers: [AppService]
        }).compile()

        appController = app.get<AppController>(AppController)
    })

    describe('root', () => {
        it('should return the message', () => {
            expect(appController.getHello()).toBe(
                'Projeto para um possível e-commerce, utilizando filas para criar os pedidos. Caso queira dar uma olhada na documentação acesse a rota /docs'
            )
        })
    })
})
