import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('proverbes')
export class Proverbe {
  @PrimaryGeneratedColumn()
  id: number;
  proverbe: string;
}
