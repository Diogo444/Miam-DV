import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('suggestions')
export class Suggestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column({ unique: true })
  suggestion: string;
}
