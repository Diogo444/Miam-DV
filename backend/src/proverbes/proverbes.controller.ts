import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProverbesService } from './proverbes.service';
import { CreateProverbeDto } from './dto/create-proverbe.dto';
import { UpdateProverbeDto } from './dto/update-proverbe.dto';

@Controller('api/proverbes')
export class ProverbesController {
  constructor(private readonly proverbesService: ProverbesService) {}

  @Post()
  create(@Body() createProverbeDto: CreateProverbeDto) {
    return this.proverbesService.create(createProverbeDto);
  }

  @Get()
  findAll() {
    return this.proverbesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.proverbesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProverbeDto: UpdateProverbeDto) {
    return this.proverbesService.update(+id, updateProverbeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.proverbesService.remove(+id);
  }
}
