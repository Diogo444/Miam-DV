import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('menus')
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  jour: string;

  @Column()
  periode: string;

  @Column()
  entree: string;

  @Column()
  plat: string;

  @Column()
  fromage: string;

  @Column()
  dessert: string;
}
