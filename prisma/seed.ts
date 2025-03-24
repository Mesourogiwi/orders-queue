import {PrismaClient} from '@prisma/client'
const prisma = new PrismaClient()
import * as bcrypt from 'bcrypt'

const seed = async () => {
    await prisma.customer.delete({
        where: {
            cpf: process.env.ADMIN_SEED_CPF!
        }
    })
    await prisma.customer.create({
        data: {
            name: 'Admin',
            email: process.env.ADMIN_SEED_EMAIL!,
            cpf: process.env.ADMIN_SEED_CPF!,
            password: await bcrypt.hash(process.env.ADMIN_SEED_PASSWORD!, 10),
            role: 'ADMIN'
        }
    })
}

seed()
    .then(async () => await prisma.$disconnect())
    .catch(async e => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
