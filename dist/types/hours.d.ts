import { Chronos } from './chronos';
import { HoursData } from './schedules';
export interface Hours {
    min: Chronos;
    max: Chronos;
    breaks: Chronos[];
    isOpen(hour: Chronos): boolean;
    compileTimes(text: string): void;
}
export declare enum DAYS {
    SUNDAY = 0,
    MONDAY = 1,
    TUESDAY = 2,
    WEDNESDAY = 3,
    THURSDAY = 4,
    FRIDAY = 5,
    SATURDAY = 6
}
export declare const getDayString: (dayIndex: number) => "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | undefined;
export declare const getDayIndex: (dayString: string) => -1 | DAYS | 7;
export declare const incrementDay: (day: number) => number;
export type Segment = {
    start: Chronos;
    end: Chronos;
};
export type HoursSelect = {
    min: number;
    breaks: number[];
    max: number;
};
export declare class Hours {
    min: Chronos;
    max: Chronos;
    breaks: Chronos[];
    as_text: string;
    collisions: number;
    static OPEN: number;
    static CLOSED: number;
    static DIGIT_IN_TIME: number;
    static APM_IN_TIME: number;
    static HOURS_LOCATOR_PREFIX: number;
    static SUNDAY: number;
    static ISOLATED_DAY_IN_PATTERN: number;
    static ISOLATED_COMMA_IN_PATTERN: number;
    static DAY_PATTERN: string;
    static SIMPLE_HOURS_PATTERN: string;
    static HOURS_PATTERN: string;
    static COMBINED_SCHEDULE_SPLIT_PATTERN: string;
    static OPEN_CLOSED_PATTERN: RegExp;
    id: () => string;
    localize(): Hours;
    globalize(): Hours;
    getMin: () => Chronos;
    getMax: () => Chronos;
    to_string: () => string;
    toBreaks: () => Chronos[];
    toSegments: () => Segment[];
    isEqual: (other: Hours) => boolean;
    add: (other: {
        start_time: Chronos;
        end_time: Chronos;
    }) => Hours | null;
    subtract: (other: {
        start_time: Chronos;
        end_time: Chronos;
        [key: string]: any;
    }) => Hours | boolean;
    union: (other: Hours) => Hours | boolean;
    getNumberOfHours(): number;
    isOpenWithContext(hour?: Chronos): {
        isOpen: boolean;
        context: string;
    };
    eject(): HoursData;
    constructor(hoursString?: string);
    constructor(min: number, max: number, breaks?: number[], time_zone_offset?: number);
}
