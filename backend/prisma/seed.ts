import { PrismaClient } from '@prisma/client'
import { date, internet, name, random } from 'faker'

const prisma = new PrismaClient()

async function main() {
  console.log(`Start seeding...`)
  for (let i = 1; i <= 5; i++) {
    const firstName = name.firstName()
    const lastName = name.lastName()
    const code = random.word().toLowerCase()
    const fullName = `${firstName} ${lastName}`
    const image = internet.avatar()
    const birthDate = date.past()
    const createdAt = date.recent()

    const user = await prisma.user.create({
      data: {
        code,
        name: fullName,
        image,
        birthDate,
        createdAt
      }
    })

    console.log(`Created user ${i} with id ${user.id}`)
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
