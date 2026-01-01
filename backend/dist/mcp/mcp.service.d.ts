import { Repository } from 'typeorm';
import { PublishWeekMenuDto } from './dto/publish-week-menu.dto';
import { PublishWeekProverbDto } from './dto/publish-week-proverb.dto';
import { ClearWeekDataDto } from './dto/clear-week-data.dto';
import { WeekMenu } from './entities/week-menu.entity';
import { WeekProverb } from './entities/week-proverb.entity';
import { Menu } from '../menus/entities/menu.entity';
import { Proverbe } from '../proverbes/entities/proverbe.entity';
export declare class McpService {
    private readonly weekMenuRepository;
    private readonly weekProverbRepository;
    private readonly menuRepository;
    private readonly proverbeRepository;
    private readonly logger;
    constructor(weekMenuRepository: Repository<WeekMenu>, weekProverbRepository: Repository<WeekProverb>, menuRepository: Repository<Menu>, proverbeRepository: Repository<Proverbe>);
    publishWeekMenu(dto: PublishWeekMenuDto): Promise<{
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
    logAudit(tool: string, weekStart: string, success: boolean): void;
    private normalizeWeekMenuItems;
    private replaceLegacyMenus;
    private replaceLegacyProverbe;
    private ensureUniqueDays;
    private resolveWeekStart;
    private assertValidWeekStart;
}
