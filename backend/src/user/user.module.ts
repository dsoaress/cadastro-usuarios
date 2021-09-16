import { Module } from '@nestjs/common'

import { FileModule } from '../file/file.module'
import { PrismaService } from '../prisma/prisma.service'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  imports: [FileModule],
  controllers: [UserController],
  providers: [UserService, PrismaService]
})
export class UserModule {}
