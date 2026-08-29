import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProverbesService } from './proverbes.service';
import { CreateProverbeDto } from './dto/create-proverbe.dto';
import { UpdateProverbeDto } from './dto/update-proverbe.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/auth/roles.guard';

@Controller('api/proverbes')
export class ProverbesController {
  constructor(private readonly proverbesService: ProverbesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  createOrReplace(@Body() dto: CreateProverbeDto) {
    return this.proverbesService.createOrReplace(dto);
  }

  @Patch()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  update(@Body() dto: UpdateProverbeDto) {
    return this.proverbesService.update(dto);
  }

  @Get()
  findOne() {
    return this.proverbesService.findOne();
  }

  @Get('suggested')
  findSuggested() {
    return this.proverbesService.findSuggested();
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  remove() {
    return this.proverbesService.remove();
  }
}
