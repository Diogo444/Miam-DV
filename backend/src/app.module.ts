import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { MenusModule } from './menus/menus.module';
import { ProverbesModule } from './proverbes/proverbes.module';
import { AdminModule } from './admin/admin.module';
import { SuggestionsModule } from './suggestions/suggestions.module';
import { LoginModule } from './login/login.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'miammi',
      password: 'BDDmiammi',
      database: 'miamdv',
      autoLoadEntities: true,
      synchronize: true, // ok en dev uniquement
    }),
    MenusModule,
    ProverbesModule,
    AdminModule,
    SuggestionsModule,
    LoginModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
