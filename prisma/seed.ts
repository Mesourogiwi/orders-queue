import {PrismaClient} from '@prisma/client'
const prisma = new PrismaClient()
import * as bcrypt from 'bcrypt'

const seed = async () => {
    await prisma.customer.create({
        data: {
            name: 'Admin',
            email: process.env.ADMIN_EMAIL!,
            cpf: process.env.ADMIN_CPF!,
            password: await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10),
            role: 'ADMIN'
        }
    })
}

seed()
    .then(async () => await prisma.$disconnect())
    .catch(async () => await prisma.$disconnect())
