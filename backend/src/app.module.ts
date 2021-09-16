import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AppController } from './app.controller'
import { FileModule } from './file/file.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UserModule, FileModule],
  controllers: [AppController],
  providers: []
})
export class AppModule {}
