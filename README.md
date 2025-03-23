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

## Testando o projeto manualmente 👷

Para testar com alguns dados locais, você vai precisar de um usuário do tipo `ADMIN` para realizar certas ações, principalmente para cadastrar os itens no sistema. Para isso, deixei um script pronto para rodar e você ter acesso a essas operações. Basta rodar o comando

```bash
$ npx prisma db seed
```

Lembrando que é necessário ter o seu .env atualizado, como descrito acima, pois pra esse comando é necessário ter as variáveis de ambiente `ADMIN_SEED_PASSWORD`, `ADMIN_SEED_EMAIL` e `ADMIN_SEED_CPF`.

As operações limitadas a admin são:

- CUSTOMERS: Retornar todos os dados e deletar um customer
- ITEMS: Criar, atualizar e deletar um item
- ORDERS: Atualizar status do pedido e retornar todos os pedidos

### Fluxo sugerido 🏄‍♂️

Após rodar o comando para semar o banco de dados com um usuário do tipo `ADMIN`, recomendo seguir os passos:

1. Logar com o usuário ADMIN através do endpoint `POST /auth/login`, passando o cpf e senha no corpo da requisição e pegar seu respectivo token;
2. Acessar o endpoint para criar um novo item `POST /items`, passando o nome, preço e quantidade em estoque do item;
3. Cadastrar um novo usuário do tipo `CUSTOMER`, através do endpoint `POST /customers`, passando cpf, email, nome e senha no corpo da requisição.;
   3.1. Para isso, é necessário passar um cpf válido, recomendo que use um gerador de cpf como esse [site](https://www.4devs.com.br/gerador_de_cpf)
4. Criar um novo pedido através do endpoint `POST /orders`, passando o id do pedido, id do customer e um array `orderItems` passando o id do(s) item(s), bem como a quantidade
5. Isso deve chamar a fila e, posteriormente, pode ser visualizado se o pedido foi criado pelo endpoint `GET /orders/:id` com o ID de pedido passado no passo anterior.

O fluxo descrito acima é o fluxo feliz, mas recomendo fortemente fazer alguns testes como:

- Tentar acessar endpoints acessíveis apenas para `ADMINS` para um usuário comum, passando o accessToken gerado pelo JWT de um usuário sem essas permissões;
- Tentar passar credenciais inválidas no login;
- Tentar criar um pedido com um ID já existente;
- Tentar passar um customerId inválido na hora da criação de um pedido;
- Tentar colocar uma quantidade maior de itens no pedido do que itens do estoque;

Além é claro, de testar TODOS os endpoints disponibilizados pela API.

Os testes podem ser feitos através do próprio [Swagger](https://orders-queue-production.up.railway.app/docs) que foi upado pelo serviço de cloud, mas nada impede de usar um Postman para esses testes

Também é recomendado rodar os testes locais pelos comandos descritos abaixo

## Comandos de testes automatizados 🧪

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
