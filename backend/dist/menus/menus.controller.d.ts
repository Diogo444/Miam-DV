import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
export declare class MenusController {
    private readonly menusService;
    constructor(menusService: MenusService);
    create(createMenuDto: CreateMenuDto): Promise<import("./entities/menu.entity").Menu>;
    findAll(): Promise<import("./entities/menu.entity").Menu[]>;
    findOne(id: number): Promise<import("./entities/menu.entity").Menu>;
    update(id: number, updateMenuDto: UpdateMenuDto): Promise<import("./entities/menu.entity").Menu>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
    removeAll(): Promise<void>;
}
