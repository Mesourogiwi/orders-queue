# Descrição do projeto 📝

Esse é um projeto que faz parte de um desafio técnico. O desafio consiste em uma API simples utilizando NestJS, em que usuários fazem pedidos, adicionando itens, verificando se determinado pedido já existe na base, se é um usuário válido, se a quantidade em estoque é suficiente e depois dessas validações, é mandado para uma fila que é responsável por criar o pedido do usuário.

A partir da descrição do projeto, pensei em fazer algumas coisas mais voltadas para o sentido de um e-commerce. Na parte do usuário adicionei autenticações com criação de token JWT, estruturando toda a base do pedido a partir dos itens, que possuem seu preço e quantidade em estoque.

# Rodando o projeto ✅

## Setups iniciais ⚒️

Instale todas as dependências do projeto rodando o comando:

```bash
$ npm install
```

Para rodar o projeto corretamente é necessário rodar um banco de dados local, seja via Docker ou na própria máquina e adicionar no arquivo `.env` a variável de ambiente `DATABASE_URL` com o link de conexão para o seu banco.

Falando em `.env`, é necessário adicionar algumas variáveis de ambiente para conseguir rodar o projeto apropriadamente. Entre em contato comigo no meu e-mail [lucas.honorato.dev@gmail.com](mailto:lucas.honorato.dev@gmail.com), com uma das seguintes formas:

1. A primeira forma e que recomendo fortemente é: solicite fornecendo o seu e-mail para eu te adicionar no time no dotenv. Essa forma é a mais recomendada pois você sempre conseguirá manter as suas variáveis de ambiente atualizadas e mantemos um nível de segurança. Quando eu te adicionar no projeto, rode os comandos:

```bash
$ npx dotenv-vault@latest login
```

```bash
$ npx dotenv-vault@latest pull
```

Ele funciona de forma bem semelhante ao github 😁

2. A segunda forma é simplesmente solicitando as variáveis e eu respondo pelo e-mail fornecendo, assim você consegue rodar o projeto localmente sem problemas.

Por fim, após setado o banco de dados, você já consegue rodar os comandos iniciais.

## Compilando e rodando o projeto ▶️

Utilize os comando abaixos para rodar o projeto, o primeiro rodando normalmente e o segundo no modo dev para atualizar automaticamente quando há alguma mudança:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Comandos de teste 🧪

Rode os comandos abaixo para rodar os testes localmente:

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# Projeto na nuvem e documentação ☁️

Esse projeto foi upado em um serviço de nuvem (railway). Tanto o código em si quanto o banco de dados. Para acessar, você pode utilizar esse [link](https://orders-queue-production.up.railway.app) que redireciona para a raíz do projeto, ou, o que eu recomendo é ir no link direto para a [documentação do Swagger](https://orders-queue-production.up.railway.app/docs), onde lá é possível ver os schemas, os endpoints e até testar por lá

# Ferramentas e escolhas técnicas 🔨

- **NestJs:** O framework mais conhecido e fomentado pela comunidade em Nodejs, traz ótimas vantagens no seu desenvolvimento, como por exemplo:
    - Bem documentado;
    - Comunidade muito ativa, fazendo com que tenham muitos tópicos abertos tanto no stack overflow, quanto na comunidade do discord, além da comunidade sempre contribuir para melhoria contínua;
    - Agilidade no desenvolvimento, pelos comandos `nest g ...`, facilita e já vem com uma arquitetura pronta, utilizando de services, controllers e modules.
- **MySQL:** Foi escolhido um banco de dados relacional MySQL por ter algumas relações entre as entidades criadas e também é um banco consolidado. O ponto principal que levou essa escolha em relação ao Postgres, por exemplo, é pelo menor consumo de CPU e RAM quando o projeto foi alocado na nuvem, mas o Postgres acaba sendo a escolha certa quando o assunto é performance.
- **Prisma:** A escolha da ORM se deve ao fato de se manter simples no desenvolvimento, além de gerar as tipagens automaticamente e trazer features muito interessantes como o Prisma Studio, também é bem intuitivo e bem documentado.
- **AWS/SQS:** Serviço de filas da Amazon, traz robustez e permite fazer muitas configurações em seu painel, sendo capaz de configurar DLQs e políticas de retentativa. Além de que, uma vez usando esse serviço, fica mais fácil configurar outros serviços fornecidos pela AWS, como bucket s3, Lambdas, Dynamo, etc.
- **Swagger:** Escolha para documentação, oferece uma forma simples de deixar o projeto documentado, além de permitir fazer testes pela própria interface como se fosse no Postman.
- **Railway:** O serviço escolhido para subir o projeto. Das opções que já utilizei, railway se mostrou a mais competente para hospedar gratuitamente meus projetos, trazendo uma interface simples e intuitiva, possibilitando várias configurações e um bom free tier

## Processo de desenvolvimento 👨‍💻

O processo foi feito majoritariamente com base na própria documentação do Nestjs, já que a mesma fornece muitas informações e exemplos práticos na criação do backend. Partes como testes, auth guard, documentação com swagger, setup do Prisma foram feitos com base nisso. Algumas outras coisas foram feitas com ajuda de IA, como chatGPT para debater algumas ideias e soluções, ajuda na construção e setup com a AWS e codeium para ter mais agilidade no desenvolvimento
