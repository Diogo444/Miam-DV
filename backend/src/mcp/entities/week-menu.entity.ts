import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('week_menus')
export class WeekMenu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', unique: true })
  weekStart: string;

  @Column({ type: 'json' })
  items: unknown;

  @Column({ type: 'text', nullable: true })
  notes?: string | null;

  @UpdateDateColumn()
  updatedAt: Date;
}
