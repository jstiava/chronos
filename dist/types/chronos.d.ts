import dayjs from './dayjs';
export declare class Chronos {
    hour: number;
    minute: number;
    constructor(num?: number | any[], roundBy24?: boolean);
    setHour(num?: number, roundBy24?: boolean): void;
    setMinute(num?: number): void;
    changeHour(amount?: number): number;
    changeMinute(amount?: number): number;
    add(amount?: number, roundBy24?: boolean): Chronos;
    getHMN(truncate?: number, dangerousRoundBy24?: boolean): number;
    getMinute(): number;
    getHour(amount?: number): number;
    printHour(): number;
    private printSimple;
    print(simple?: boolean, truncate?: number, amp?: boolean): string;
    printMinute(): string;
    to(other: Chronos | null, truncate?: number, format?: {
        hour: string;
        minute: string;
    }): string;
    getAMP(): "PM" | "AM";
    getDayjs(truncate?: number, isLocal?: boolean): dayjs.Dayjs;
    isEqual(other: Chronos): boolean;
    isAfter(other: Chronos, inclusive?: boolean): boolean;
    isBefore(other: Chronos, inclusive?: boolean): boolean;
    isWithin(startingTime: Chronos, endingTime: Chronos): boolean;
    is(other: Chronos): boolean;
    truncate(amount: number): this;
    static toMinutes(value: number): number;
    static absDiff(end: Chronos, start: Chronos): number;
    static within(event: Chronos | null, start: Chronos, duration: number): boolean;
}
