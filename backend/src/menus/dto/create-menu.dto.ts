import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMenuDto {
  @IsString()
  @IsNotEmpty()
  jour: string;

  @IsString()
  @IsNotEmpty()
  periode: string;

  @IsString()
  @IsNotEmpty()
  entree: string;

  @IsString()
  @IsNotEmpty()
  plat: string;

  @IsString()
  @IsNotEmpty()
  fromage: string;

  @IsString()
  @IsNotEmpty()
  dessert: string;
}
