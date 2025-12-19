import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { Proverbe } from 'src/proverbes/entities/proverbe.entity';

@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
    @InjectRepository(Proverbe)
    private proverbeRepository: Repository<Proverbe>,
  ) {}
  async create(createMenuDto: CreateMenuDto) {
    const existingMenu = await this.menuRepository.findOneBy({
      jour: createMenuDto.jour,
      periode: createMenuDto.periode,
    });

    if (existingMenu) {
      return {
        created: false,
        message: `Un menu pour ${createMenuDto.jour} ${createMenuDto.periode.toLowerCase()} existe déjà.`,
        menu: existingMenu,
      };
    }

    const menu = this.menuRepository.create(createMenuDto);
    const savedMenu = await this.menuRepository.save(menu);

    return {
      created: true,
      message: 'Menu ajouté avec succès.',
      menu: savedMenu,
    };
  }

  findAll() {
    return this.menuRepository.find();
  }

  async findOne(id: number) {
    const menu = await this.menuRepository.findOneBy({ id });
    if (!menu) {
      throw new NotFoundException(`Menu ${id} not found`);
    }
    return menu;
  }

  async update(id: number, updateMenuDto: UpdateMenuDto) {
    const menu = await this.menuRepository.preload({ id, ...updateMenuDto });
    if (!menu) {
      throw new NotFoundException(`Menu ${id} not found`);
    }
    const savedMenu = await this.menuRepository.save(menu);
    return {
      message: 'Menu mis à jour avec succès.',
      menu: savedMenu,
    };
  }

  remove(id: number) {
    return this.menuRepository.delete(id);
  }

  @Cron('0 16 * * 5', {
    timeZone: 'Europe/Paris',
  })
  async removeAll() {
    // vider les tables proprement
    await this.menuRepository.clear();
    await this.proverbeRepository.clear();

    // bon retour pour vérifier dans les logs
    return { message: 'All menus and proverbes have been removed.' };
  }
}
