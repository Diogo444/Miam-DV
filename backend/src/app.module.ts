import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { MenusModule } from './menus/menus.module';
import { ProverbesModule } from './proverbes/proverbes.module';
import { AdminModule } from './admin/admin.module';
import { SuggestionsModule } from './suggestions/suggestions.module';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),

    ConfigModule.forRoot({
      isGlobal: true, // accessible partout sans réimport
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    MenusModule,
    ProverbesModule,
    AdminModule,
    SuggestionsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
