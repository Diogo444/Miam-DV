export declare enum Weekday {
    Monday = "monday",
    Tuesday = "tuesday",
    Wednesday = "wednesday",
    Thursday = "thursday",
    Friday = "friday"
}
export declare const WEEKDAY_ALIASES: Record<string, Weekday>;
export declare function normalizeWeekday(value: string): Weekday;
export declare class MenuItemDto {
    day: string;
    main?: string;
    starter?: string;
    dessert?: string;
    lunch?: string[];
    dinner?: string[];
    midi?: string[];
    soir?: string[];
    allergens?: string[];
}
