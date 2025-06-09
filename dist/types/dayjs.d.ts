import { Chronos } from './chronos';
import type { Dayjs as DayjsType } from 'dayjs';
import dayjs from 'dayjs';
import '../types/dayjs';
declare module 'dayjs' {
    interface Dayjs {
        getTimezoneOffsetInHours(): number;
        getTimezoneName(): string;
        asNumber(): number;
        toChronos(): Chronos;
        toLocalChronos(): Chronos;
        isInDayView(threshold: number): boolean;
        isYesterday(): boolean;
        isTomorrow(): boolean;
        yyyymmdd(): number;
        getDeixis(fallback: string, short?: boolean): string;
        getFrame(arg1?: number): DayjsType[];
        to(other: DayjsType | null | undefined, includeYear?: boolean, format?: {
            month?: string;
            day?: string;
            year?: string;
        }): string;
        setTime(time: Chronos): DayjsType;
        duration(other: DayjsType | null | undefined): string;
        max(second: DayjsType): DayjsType;
        min(second: DayjsType): DayjsType;
        flipMeridium(): DayjsType;
    }
}

export default dayjs;
export type { Dayjs } from 'dayjs';
