import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SuggestionsService } from './suggestions.service';
import { CreateSuggestionDto } from './dto/create-suggestion.dto';
import { UpdateSuggestionDto } from './dto/update-suggestion.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('api/suggestions')
export class SuggestionsController {
  constructor(private readonly suggestionsService: SuggestionsService) {}

  @Post()
  create(@Body() createSuggestionDto: CreateSuggestionDto) {
    
    return this.suggestionsService.create(createSuggestionDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Roles('admin')
  @Get()
  findAll() {
    return this.suggestionsService.findAll();
  }

  @Post('accept/:id')
  accept(@Param('id') id: string) {
    return this.suggestionsService.accept(+id);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.suggestionsService.remove(+id);
  }
}
