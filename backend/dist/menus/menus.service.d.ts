import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu } from './entities/menu.entity';
import { Repository } from 'typeorm';
export declare class MenusService {
    private menuRepository;
    constructor(menuRepository: Repository<Menu>);
    create(createMenuDto: CreateMenuDto): Promise<Menu>;
    findAll(): Promise<Menu[]>;
    findOne(id: number): Promise<Menu>;
    update(id: number, updateMenuDto: UpdateMenuDto): Promise<Menu>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
    removeAll(): Promise<void>;
}
