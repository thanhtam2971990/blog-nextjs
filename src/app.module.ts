import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from '../db/data-source';
import { AuthModule } from './auth/auth.module';
import {ConfigModule} from '@nestjs/config';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    UserModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
