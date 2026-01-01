import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PublishWeekMenuDto } from './dto/publish-week-menu.dto';
import { PublishWeekProverbDto } from './dto/publish-week-proverb.dto';
import { ClearWeekDataDto } from './dto/clear-week-data.dto';
import { WeekMenu } from './entities/week-menu.entity';
import { WeekProverb } from './entities/week-proverb.entity';
import { MenuItemDto, normalizeWeekday } from './dto/menu-item.dto';
import { Menu } from '../menus/entities/menu.entity';
import { Proverbe } from '../proverbes/entities/proverbe.entity';

@Injectable()
export class McpService {
  private readonly logger = new Logger('McpAudit');

  constructor(
    @InjectRepository(WeekMenu)
    private readonly weekMenuRepository: Repository<WeekMenu>,
    @InjectRepository(WeekProverb)
    private readonly weekProverbRepository: Repository<WeekProverb>,
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    @InjectRepository(Proverbe)
    private readonly proverbeRepository: Repository<Proverbe>,
  ) {}

  async publishWeekMenu(dto: PublishWeekMenuDto) {
    const weekStart = this.assertValidWeekStart(dto.weekStart);
    const items = this.normalizeWeekMenuItems(dto.items);
    this.ensureUniqueDays(items);

    const existing = await this.weekMenuRepository.findOne({
      where: { weekStart },
    });

    if (existing) {
      existing.items = items;
      existing.notes = dto.notes ?? null;
      await this.weekMenuRepository.save(existing);
    } else {
      const created = this.weekMenuRepository.create({
        weekStart,
        items,
        notes: dto.notes ?? null,
      });
      await this.weekMenuRepository.save(created);
    }

    await this.replaceLegacyMenus(items);

    this.logAudit('publish_week_menu', weekStart, true);
    return { success: true, weekStart };
  }

  async publishWeekProverb(dto: PublishWeekProverbDto) {
    const weekStart = this.assertValidWeekStart(dto.weekStart);

    const existing = await this.weekProverbRepository.findOne({
      where: { weekStart },
    });

    if (existing) {
      existing.text = dto.text;
      existing.author = dto.author ?? null;
      existing.source = dto.source ?? null;
      await this.weekProverbRepository.save(existing);
    } else {
      const created = this.weekProverbRepository.create({
        weekStart,
        text: dto.text,
        author: dto.author ?? null,
        source: dto.source ?? null,
      });
      await this.weekProverbRepository.save(created);
    }

    await this.replaceLegacyProverbe(dto.type ?? 'proverbe', dto.text);

    this.logAudit('publish_week_proverb', weekStart, true);
    return { success: true, weekStart };
  }

  async clearWeekData(dto: ClearWeekDataDto) {
    const weekStart = this.resolveWeekStart(dto);

    await this.weekMenuRepository.delete({ weekStart });
    await this.weekProverbRepository.delete({ weekStart });
    await this.menuRepository.clear();
    await this.proverbeRepository.clear();

    this.logAudit('clear_week_data', weekStart, true);
    return { success: true, weekStart };
  }

  logAudit(tool: string, weekStart: string, success: boolean) {
    this.logger.log(`tool=${tool} weekStart=${weekStart} status=${success ? 'success' : 'failure'}`);
  }

  private normalizeWeekMenuItems(items: MenuItemDto[]) {
    return items.map((item) => {
      const day = normalizeWeekday(item.day);
      if (!day) {
        throw new BadRequestException(`Invalid day value: ${item.day}`);
      }

      const lunch = coerceMealList(item.lunch ?? item.midi ?? item.main);
      const dinner = coerceMealList(item.dinner ?? item.soir ?? item.starter);

      if (!lunch && !dinner) {
        throw new BadRequestException(
          `Each menu item must include lunch/main or dinner/starter for ${day}`,
        );
      }

      const normalized: NormalizedMenuItem = { day };

      if (lunch?.length) {
        normalized.lunch = lunch;
        normalized.main = item.main ?? joinMealList(lunch);
      } else if (item.main) {
        normalized.main = item.main;
      }

      if (dinner?.length) {
        normalized.dinner = dinner;
        normalized.starter = item.starter ?? joinMealList(dinner);
      } else if (item.starter) {
        normalized.starter = item.starter;
      }

      if (item.dessert) {
        normalized.dessert = item.dessert;
      }

      if (item.allergens?.length) {
        normalized.allergens = item.allergens;
      }

      return normalized;
    });
  }

  private async replaceLegacyMenus(items: NormalizedMenuItem[]) {
    await this.menuRepository.clear();

    const menus = items.flatMap((item) => {
      const jour = LEGACY_DAY_LABELS[item.day] ?? item.day;
      const legacyMenus: Menu[] = [];

      if (item.lunch?.length) {
        const fields = mapMealToLegacyFields(item.lunch, item.dessert);
        legacyMenus.push(
          this.menuRepository.create({
            jour,
            periode: 'Déjeuner',
            ...fields,
          }),
        );
      }

      if (item.dinner?.length) {
        const fields = mapMealToLegacyFields(item.dinner);
        legacyMenus.push(
          this.menuRepository.create({
            jour,
            periode: 'Dîner',
            ...fields,
          }),
        );
      }

      return legacyMenus;
    });

    if (menus.length > 0) {
      await this.menuRepository.save(menus);
    }
  }

  private async replaceLegacyProverbe(type: 'blague' | 'proverbe', content: string) {
    await this.proverbeRepository.clear();
    const proverbe = this.proverbeRepository.create({ id: 1, type, content });
    await this.proverbeRepository.save(proverbe);
  }

  private ensureUniqueDays(items: Array<{ day: string }>) {
    const seen = new Set<string>();
    for (const item of items) {
      if (seen.has(item.day)) {
        throw new BadRequestException('Duplicate day entries are not allowed');
      }
      seen.add(item.day);
    }
  }

  private resolveWeekStart(dto: ClearWeekDataDto) {
    if (dto.weekStart && dto.scope) {
      throw new BadRequestException('Provide weekStart or scope, not both');
    }
    if (dto.weekStart) {
      return this.assertValidWeekStart(dto.weekStart);
    }
    if (dto.scope === 'currentWeek') {
      return getCurrentWeekStart();
    }
    throw new BadRequestException('weekStart or scope is required');
  }

  private assertValidWeekStart(weekStart: string) {
    const date = parseLocalDate(weekStart);
    if (!date) {
      throw new BadRequestException('weekStart must be a valid YYYY-MM-DD date');
    }
    if (date.getDay() !== 1) {
      throw new BadRequestException('weekStart must be a Monday');
    }
    return weekStart;
  }
}

type NormalizedMenuItem = {
  day: string;
  main?: string;
  starter?: string;
  dessert?: string;
  lunch?: string[];
  dinner?: string[];
  allergens?: string[];
};

const LEGACY_DAY_LABELS: Record<string, string> = {
  monday: 'Lundi',
  tuesday: 'Mardi',
  wednesday: 'Mercredi',
  thursday: 'Jeudi',
  friday: 'Vendredi',
};

function mapMealToLegacyFields(dishes: string[], dessertOverride?: string) {
  const cleaned = dishes.map((dish) => dish.trim()).filter(Boolean);
  const override = dessertOverride?.trim();

  if (cleaned.length === 0) {
    return { entree: '', plat: '', fromage: '', dessert: override ?? '' };
  }

  if (cleaned.length === 1) {
    return { entree: '', plat: cleaned[0], fromage: '', dessert: override ?? '' };
  }

  if (cleaned.length === 2) {
    return {
      entree: cleaned[0],
      plat: cleaned[1],
      fromage: '',
      dessert: override ?? '',
    };
  }

  if (cleaned.length === 3) {
    return {
      entree: cleaned[0],
      plat: cleaned[1],
      fromage: override ? cleaned[2] : '',
      dessert: override ?? cleaned[2],
    };
  }

  const entree = cleaned[0];
  const platParts = cleaned.length >= 5 ? [cleaned[1], cleaned[2]] : [cleaned[1]];
  const fromage = cleaned[cleaned.length - 2] ?? '';
  const dessert = override ?? cleaned[cleaned.length - 1] ?? '';

  return {
    entree,
    plat: platParts.filter(Boolean).join(' - '),
    fromage,
    dessert,
  };
}

function coerceMealList(value?: string[] | string | null) {
  if (!value) {
    return undefined;
  }
  if (Array.isArray(value)) {
    const cleaned = value.map((entry) => entry.trim()).filter(Boolean);
    return cleaned.length > 0 ? cleaned : undefined;
  }
  if (typeof value === 'string') {
    const cleaned = splitMealText(value);
    return cleaned.length > 0 ? cleaned : undefined;
  }
  return undefined;
}

function splitMealText(value: string) {
  return value
    .split(/\r?\n|;/g)
    .map((entry) => entry.replace(/^[-\s]+/, '').trim())
    .map((entry) => entry.replace(/^(midi|soir)\s*:?\s*/i, '').trim())
    .filter(Boolean);
}

function joinMealList(items: string[]) {
  return items.join('; ');
}

function parseLocalDate(value: string) {
  const parts = value.split('-').map((part) => Number(part));
  if (parts.length !== 3) {
    return null;
  }
  const [year, month, day] = parts;
  if (!year || !month || !day) {
    return null;
  }
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

function getCurrentWeekStart() {
  const now = new Date();
  const day = now.getDay();
  const diff = (day + 6) % 7;
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diff);
  return formatLocalDate(monday);
}

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
