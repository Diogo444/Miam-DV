import {
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform, type TransformFnParams } from 'class-transformer';

export class PublishWeekProverbDto {
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  weekStart!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(800)
  text!: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }: TransformFnParams) => normalizeType(value as unknown))
  @IsIn(['blague', 'proverbe'])
  type?: 'blague' | 'proverbe';

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  author?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  source?: string;
}

function normalizeType(value: unknown): unknown {
  return typeof value === 'string' ? value.trim().toLowerCase() : value;
}
