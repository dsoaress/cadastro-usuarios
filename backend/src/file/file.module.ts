import { Module } from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'
import { FileService } from './file.service'

@Module({
  providers: [FileService, PrismaService],
  exports: [FileService]
})
export class FileModule {}
