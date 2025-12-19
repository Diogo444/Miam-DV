import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('suggestions')
export class Suggestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ enum: ['Blague', 'Proverbe'] })
  type: 'Blague' | 'Proverbe';

  @Column({ name: 'suggestion', unique: true })
  content: string;
}
