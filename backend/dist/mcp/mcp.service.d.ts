import { Repository } from 'typeorm';
import { PublishWeekMenuDto } from './dto/publish-week-menu.dto';
import { PublishWeekProverbDto } from './dto/publish-week-proverb.dto';
import { ClearWeekDataDto } from './dto/clear-week-data.dto';
import { WeekMenu } from './entities/week-menu.entity';
import { WeekProverb } from './entities/week-proverb.entity';
import { MenuItemDto } from './dto/menu-item.dto';
import { Menu } from '../menus/entities/menu.entity';
import { Proverbe } from '../proverbes/entities/proverbe.entity';
import { ProverbeSuggered } from '../proverbes/entities/proverbe_suggered.entity';
export declare class McpService {
    private readonly weekMenuRepository;
    private readonly weekProverbRepository;
    private readonly menuRepository;
    private readonly proverbeRepository;
    private readonly proverbeSuggeredRepository;
    private readonly logger;
    constructor(weekMenuRepository: Repository<WeekMenu>, weekProverbRepository: Repository<WeekProverb>, menuRepository: Repository<Menu>, proverbeRepository: Repository<Proverbe>, proverbeSuggeredRepository: Repository<ProverbeSuggered>);
    publishWeekMenu(dto: PublishWeekMenuInput): Promise<{
        success: boolean;
        weekStart: string;
    }>;
    publishWeekProverb(dto: PublishWeekProverbDto): Promise<{
        success: boolean;
        weekStart: string;
    }>;
    clearWeekData(dto: ClearWeekDataDto): Promise<{
        success: boolean;
        weekStart: string;
    }>;
    getWeekData(weekStart?: string): Promise<{
        weekStart: string;
        menu: {
            items: unknown;
            notes: string | null;
            updatedAt: Date;
        } | null;
        proverb: {
            text: string;
            author: string | null;
            source: string | null;
            updatedAt: Date;
        } | null;
    }>;
    logAudit(tool: string, weekStart: string, success: boolean): void;
    private normalizeWeekMenuItems;
    private replaceLegacyMenus;
    private replaceLegacyProverbe;
    private ensureUniqueDays;
    private resolveWeekStart;
    private assertValidWeekStart;
}
type PublishWeekMenuInput = Omit<PublishWeekMenuDto, 'items'> & {
    items: MenuItemInput[];
};
type MenuItemInput = Omit<MenuItemDto, 'lunch' | 'dinner' | 'midi' | 'soir'> & {
    lunch?: string[] | string;
    dinner?: string[] | string;
    midi?: string[] | string;
    soir?: string[] | string;
};
export {};
