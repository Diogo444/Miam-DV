import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import type { Request } from 'express';
export declare class MenusController {
    private readonly menusService;
    constructor(menusService: MenusService);
    create(createMenuDto: CreateMenuDto, req: Request): Promise<{
        created: boolean;
        message: string;
        menu: import("./entities/menu.entity").Menu;
    }>;
    findAll(): Promise<import("./entities/menu.entity").Menu[]>;
    findOne(id: number): Promise<import("./entities/menu.entity").Menu>;
    update(id: number, updateMenuDto: UpdateMenuDto): Promise<{
        message: string;
        menu: import("./entities/menu.entity").Menu;
    }>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
    removeAll(): Promise<{
        message: string;
    }>;
}
