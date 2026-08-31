import { IsIn, IsString, Matches } from 'class-validator';

export class DeleteWeekMenuDto {
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  weekStart!: string;

  @IsString()
  @IsIn(['DELETE_WEEK_MENU'])
  confirm!: 'DELETE_WEEK_MENU';
}

export class DeleteWeekMessageDto {
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  weekStart!: string;

  @IsString()
  @IsIn(['DELETE_WEEK_MESSAGE'])
  confirm!: 'DELETE_WEEK_MESSAGE';
}
