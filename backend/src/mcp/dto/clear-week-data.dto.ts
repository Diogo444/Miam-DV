import { Equals, IsIn, IsOptional, IsString, Matches } from 'class-validator';

export class ClearWeekDataDto {
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  weekStart?: string;

  @IsOptional()
  @IsString()
  @IsIn(['currentWeek'])
  scope?: 'currentWeek';

  @Equals('CLEAR_WEEK_DATA')
  confirm: 'CLEAR_WEEK_DATA';
}
