import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MenusModule } from './menus/menus.module';
import { ProverbesModule } from './proverbes/proverbes.module';
import { AdminModule } from './admin/admin.module';
import { SuggestionsModule } from './suggestions/suggestions.module';

@Module({
  imports: [MenusModule, ProverbesModule, AdminModule, SuggestionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
