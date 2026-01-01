import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export enum Weekday {
  Monday = 'monday',
  Tuesday = 'tuesday',
  Wednesday = 'wednesday',
  Thursday = 'thursday',
  Friday = 'friday',
}

export const WEEKDAY_ALIASES: Record<string, Weekday> = {
  monday: Weekday.Monday,
  lundi: Weekday.Monday,
  tuesday: Weekday.Tuesday,
  mardi: Weekday.Tuesday,
  wednesday: Weekday.Wednesday,
  mercredi: Weekday.Wednesday,
  thursday: Weekday.Thursday,
  jeudi: Weekday.Thursday,
  friday: Weekday.Friday,
  vendredi: Weekday.Friday,
};

const WEEKDAY_VALUES = Object.keys(WEEKDAY_ALIASES);

function normalizeDayInput(value: unknown) {
  if (typeof value !== 'string') {
    return value;
  }
  return value.trim().toLowerCase();
}

function splitMealText(value: string) {
  return value
    .split(/\r?\n|;/g)
    .map((entry) => entry.replace(/^[-\s]+/, '').trim())
    .map((entry) => entry.replace(/^(midi|soir)\s*:?\s*/i, '').trim())
    .filter(Boolean);
}

function normalizeMealListInput(value: unknown) {
  if (value === null || value === undefined) {
    return value;
  }
  if (Array.isArray(value)) {
    return value
      .map((entry) => (typeof entry === 'string' ? entry.trim() : ''))
      .filter(Boolean);
  }
  if (typeof value === 'string') {
    return splitMealText(value);
  }
  return value;
}

export function normalizeWeekday(value: string) {
  return WEEKDAY_ALIASES[value.trim().toLowerCase()] ?? null;
}

export class MenuItemDto {
  @IsString()
  @Transform(({ value }) => normalizeDayInput(value))
  @IsIn(WEEKDAY_VALUES)
  day: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(800)
  main?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(800)
  starter?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(800)
  dessert?: string;

  @IsOptional()
  @Transform(({ value }) => normalizeMealListInput(value))
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(12)
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(200, { each: true })
  lunch?: string[];

  @IsOptional()
  @Transform(({ value }) => normalizeMealListInput(value))
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(12)
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(200, { each: true })
  dinner?: string[];

  @IsOptional()
  @Transform(({ value }) => normalizeMealListInput(value))
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(12)
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(200, { each: true })
  midi?: string[];

  @IsOptional()
  @Transform(({ value }) => normalizeMealListInput(value))
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(12)
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(200, { each: true })
  soir?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(30)
  @IsString({ each: true })
  @MaxLength(80, { each: true })
  allergens?: string[];
}
