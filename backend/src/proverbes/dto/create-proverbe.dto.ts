import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProverbeDto {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsString()
  @IsIn(['blague', 'proverbe'])
  type: 'blague' | 'proverbe';

  @IsString()
  @IsNotEmpty()
  content: string;
}
