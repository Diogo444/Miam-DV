import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { ProverbesService } from './proverbes.service';
import { CreateProverbeDto } from './dto/create-proverbe.dto';
import { UpdateProverbeDto } from './dto/update-proverbe.dto';

@Controller('api/proverbes')
export class ProverbesController {
  constructor(private readonly proverbesService: ProverbesService) {}

   @Post()
  createOrReplace(@Body() dto: CreateProverbeDto) {
    return this.proverbesService.createOrReplace(dto);
  }

  @Patch()
  update(@Body() dto: UpdateProverbeDto) {
    return this.proverbesService.update(dto);
  }

  @Get()
  findOne() {
    return this.proverbesService.findOne();
  }

  @Delete()
  remove() {
    return this.proverbesService.remove();
  }
}
