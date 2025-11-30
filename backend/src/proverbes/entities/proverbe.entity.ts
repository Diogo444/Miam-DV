import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('proverbes')
export class Proverbe {
  @PrimaryGeneratedColumn()
  id: number = 1;

  @Column({ type: 'enum', enum: ['blague', 'proverbe'] })
  type: 'blague' | 'proverbe';

  @Column({ unique: true })
  content: string;
}
