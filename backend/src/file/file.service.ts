import { Injectable } from '@nestjs/common'
import { S3 } from 'aws-sdk'
import { v4 as uuid } from 'uuid'

import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class FileService {
  constructor(private prisma: PrismaService) {}

  async create(image: Express.Multer.File) {
    const s3 = new S3({
      region: process.env.AWS_REGION
    })
    const filename = uuid()

    await s3
      .putObject({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: filename,
        ACL: 'public-read',
        Body: image.buffer,
        ContentType: image.mimetype
      })
      .promise()

    const newImage = await this.prisma.file.create({
      data: {
        filename,
        filenameUrl: `${process.env.AWS_S3_BUCKET_URL}/${filename}`,
        size: image.size,
        type: image.mimetype
      }
    })

    return newImage
  }
}
