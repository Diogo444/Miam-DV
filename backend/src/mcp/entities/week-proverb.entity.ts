import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('week_proverbes')
export class WeekProverb {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', unique: true })
  weekStart: string;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  author?: string | null;

  @Column({ type: 'varchar', length: 300, nullable: true })
  source?: string | null;

  @UpdateDateColumn()
  updatedAt: Date;
}
