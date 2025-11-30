import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
  ) {}
  async create(createMenuDto: CreateMenuDto) {
    const existingMenu = await this.menuRepository.findOneBy({
      jour: createMenuDto.jour,
      periode: createMenuDto.periode,
    });

    if (existingMenu) {
      return;
    }

    const menu = this.menuRepository.create(createMenuDto);
    return this.menuRepository.save(menu);
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
    return this.menuRepository.save(menu);
  }

  remove(id: number) {
    return this.menuRepository.delete(id);
  }

  @Cron('0 16 * * 5', {
  timeZone: 'Europe/Paris',
})
  removeAll() {
    return this.menuRepository.clear();
  }
}
