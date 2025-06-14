import { Event } from './events';
import { Dayjs } from 'dayjs';
import { Hours } from './hours';
import { Junction } from './junctions';
import { Chronos, Type } from './';
import { Member } from './index';
export declare enum ScheduleType {
    Regular = "regular",
    Special = "special",
    Closure = "closure"
}
export type HoursData = {
    min: number;
    max: number;
    breaks: number[];
};
export type ScheduleData = any & {
    metadata?: any;
    is_local?: boolean;
};
export declare class Schedule implements Member {
    uuid: string;
    name: string;
    start_date: Dayjs | null;
    end_date: Dayjs | null;
    schedule_type: string;
    as_text: string | null;
    days: number[];
    hours: Hours[];
    theme_color: null;
    type: Type;
    metadata: any;
    junctions: Map<string, Junction>;
    is_local: boolean;
    event_id: string | null;
    location_id: string | null;
    id(): string;
    getHostColumnString(): string;
    getType(): Type;
    login(): null;
    getItem(): this;
    connectTo(other: Member): null | undefined;
    getIconPath(): null;
    acquire: () => Promise<boolean>;
    isOpenDaily: () => boolean;
    getActiveDaysPerWeek(): number;
    getHoursPerWeek(): number;
    isNotRegular(): boolean;
    localize(): Schedule;
    globalize(): Schedule;
    getToken(): null;
    to_string(): string;
    copy(hoursAndDaysOnly?: boolean): ScheduleData | any;
    eject(hoursAndDaysOnly?: boolean): ScheduleData | any;
    static rank(schedules: (Schedule | ScheduleData)[]): (Schedule | ScheduleData)[];
    /**
     *
     * @param day
     * @returns
     */
    removeHoursOnDay(day: string | number): void;
    /**
     * e.g. Replace Tue's schedule with '8am-7pm' as Hours,
     * has residual effects
     * @param day
     * @param newHours
     * @returns
     */
    replaceHoursOnDayWith(day: string | number, newHours: Hours | boolean): void;
    getHours(day?: string | number, time?: Chronos): boolean | Hours;
    getNextOccurance(day?: Dayjs): {
        date: Dayjs;
        start_time: Chronos | null;
    } | null;
    isOpen(day?: string | number, time?: Chronos): boolean;
    print(day: string | number): string;
    isOpenWithContext(day?: string | number, time?: Chronos): {
        isOpen: boolean;
        context: string;
    };
    /**
     * Write on this.days from pointer to goto.
     * @param pointer day index (0, 7)
     * @param goto day index (0, 7)
     * @param value 0 closed, 1 open, ...a position in the hours array - 2
     * @example (1, 2, 3) => this.days = [x, 3, 3, x, x, x, x]
     * @returns (1, 3, 3) => 2
     */
    private writeAndMovePointer;
    private spreadHoursMappingIntoDays;
    getStringForDay: (day: number) => string;
    mask: (other: {
        start_time: Chronos;
        end_time: Chronos;
        dow: number;
    }) => void;
    unmask: (other: {
        start_time: Chronos;
        end_time: Chronos;
        dow: number;
    }) => void;
    add: (other: {
        start_time: Chronos;
        end_time: Chronos;
        date: Dayjs;
        end_date?: Dayjs | null;
    }, subtract?: boolean) => Schedule;
    subtract: (other: {
        start_time: Chronos;
        end_time: Chronos;
        date: Dayjs;
        end_date?: Dayjs | null;
    }) => Schedule;
    union: (other: Schedule | Event) => Schedule;
    constructor();
    constructor(data: Partial<ScheduleData>, is_local?: boolean);
    constructor(data: Schedule, is_local?: boolean);
    static createOffDrag: (startDate: Dayjs, endDate: Dayjs | null, startTime: Chronos, endTime: Chronos) => Schedule;
    interpret: (rawString: string) => this;
    static create: (name: string, type: string, rawString: string, startDate: Dayjs, endDate?: Dayjs | null) => Schedule;
}
