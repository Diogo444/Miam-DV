import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu } from './entities/menu.entity';
import { Repository } from 'typeorm';
import { Proverbe } from '../proverbes/entities/proverbe.entity';
import { ProverbeSuggered } from '../proverbes/entities/proverbe_suggered.entity';
export declare class MenusService {
    private menuRepository;
    private proverbeRepository;
    private proverbeSuggeredRepository;
    constructor(menuRepository: Repository<Menu>, proverbeRepository: Repository<Proverbe>, proverbeSuggeredRepository: Repository<ProverbeSuggered>);
    create(createMenuDto: CreateMenuDto): Promise<{
        created: boolean;
        message: string;
        menu: Menu;
    }>;
    findAll(): Promise<Menu[]>;
    findOne(id: number): Promise<Menu>;
    update(id: number, updateMenuDto: UpdateMenuDto): Promise<{
        message: string;
        menu: Menu;
    }>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
    removeAll(): Promise<{
        message: string;
    }>;
}
