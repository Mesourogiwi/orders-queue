import {Injectable} from '@nestjs/common'
@Injectable()
export class AppService {
    getHello(): string {
        return 'Projeto para um possível e-commerce, utilizando filas para criar os pedidos. Caso queira dar uma olhada na documentação acesse a rota /docs'
    }
}
