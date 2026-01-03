import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateSuggestionDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsIn(['Blague', 'Proverbe'])
  type: 'Blague' | 'Proverbe';
}
