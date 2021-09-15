import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create({ code, name, image, birthDate }: CreateUserDto) {
    const codeExists = await this.prisma.user.findUnique({
      where: {
        code
      }
    })

    if (codeExists) {
      throw new BadRequestException('User code already registered')
    }

    const user = await this.prisma.user.create({
      data: {
        code,
        name,
        image,
        birthDate: new Date(birthDate)
      }
    })

    return user
  }

  async findAll() {
    const users = await this.prisma.user.findMany()

    return users
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id
      }
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id)

    if (updateUserDto.code) {
      const codeExists = await this.prisma.user.findUnique({
        where: {
          code: updateUserDto.code
        }
      })

      if (codeExists) {
        if (user.code !== updateUserDto.code) {
          throw new BadRequestException('User code already registered')
        }
      }
    }

    if (updateUserDto.birthDate) {
      updateUserDto.birthDate = new Date(updateUserDto.birthDate)
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id
      },
      data: updateUserDto
    })

    return updatedUser
  }

  async remove(id: string) {
    await this.findOne(id)
    await this.prisma.user.delete({
      where: {
        id
      }
    })
  }
}
