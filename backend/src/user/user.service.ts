import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'

import { FileService } from '../file/file.service'
import { PrismaService } from '../prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private fileService: FileService) {}

  async create({ code, name, birthDate }: CreateUserDto, image?: Express.Multer.File) {
    const codeExists = await this.prisma.user.findUnique({
      where: {
        code
      }
    })

    if (codeExists) {
      throw new ForbiddenException()
    }

    let filenameUrl: string | null = null
    if (image) {
      const newImage = await this.fileService.create(image)
      filenameUrl = newImage.filenameUrl
    }

    const user = await this.prisma.user.create({
      data: {
        code,
        name,
        image: filenameUrl,
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

  async update(id: string, updateUserDto: UpdateUserDto, image?: Express.Multer.File) {
    const user = await this.findOne(id)

    if (updateUserDto.code) {
      const codeExists = await this.prisma.user.findUnique({
        where: {
          code: updateUserDto.code
        }
      })

      if (codeExists) {
        if (user.code !== updateUserDto.code) {
          throw new ForbiddenException()
        }
      }
    }

    if (updateUserDto.birthDate) {
      updateUserDto.birthDate = new Date(updateUserDto.birthDate)
    }

    if (image) {
      const newImage = await this.fileService.create(image)
      const filenameUrl = newImage.filenameUrl

      await this.prisma.user.update({
        where: {
          id
        },
        data: {
          image: filenameUrl
        }
      })
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
