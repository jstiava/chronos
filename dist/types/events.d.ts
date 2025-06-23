import { Chronos } from './chronos';
import dayjs from './dayjs';
import { ImageStub } from './files';
import { Dayjs } from 'dayjs';
import { Type } from '.';
import { Hours } from './hours';
import { Member } from '.';
import { HostData, Junction, HostFactors } from './junctions';
import { LocationData } from './locations';
import { ProfileData, Profile } from './profiles';
import { ScheduleData, Schedule } from './schedules';
export declare function isEventCalendar(event: Event): event is Event & {
    end_date: null;
};
export declare function isMultiDayEvent(event: Event): event is Event & {
    date: Dayjs;
    end_date: Dayjs;
};
export declare function isAllSingleDay(event: Event): event is Event & {
    date: Dayjs;
    end_date: Dayjs;
    start_time: null;
    end_time: null;
};
export declare function isMoment(event: Event): event is Event & {
    date: Dayjs;
    start_time: Chronos;
    end_time: null;
    end_date: null;
};
export declare function isSingleTimeEvent(event: Event): event is Event & {
    date: Dayjs;
    start_time: Chronos;
    end_time: Chronos;
    end_date: null;
};
export declare function isNotScheduled(event: Event): event is Event & {
    date: Dayjs;
    start_time: Chronos;
};
export declare function isScheduled(event: Event): event is Event & {
    schedules: Schedule[];
};
export type EventMetadata = {
    isFetched?: boolean | null;
    price?: string | null;
    event_link?: string | null;
    files?: string[] | null;
    tags?: string[] | null;
    contact_email?: string | null;
    contact_name?: string | null;
    contact_organization?: string | null;
    contact_phone?: string | null;
    isFree?: boolean | null;
    pricing_notes?: string | null;
    ticketing_link?: string | null;
    description?: string | null;
};
export type Reservation = Event | Location;
export type ReservationData = EventData | LocationData;
export type EventData = {
    uuid: string;
    name: string;
    start_time: string | null;
    end_time: string | null;
    date: number | null;
    end_date: number | null;
    location_name: string | null;
    location_address: string | null;
    location_place_id: string | null;
    end_location_name: string | null;
    end_location_address: string | null;
    end_location_place_id: string | null;
    cover_img: ImageStub | null;
    icon_img: ImageStub | null;
    wordmark_img: ImageStub | null;
    search_vectors: string[] | null;
    link: string | null;
    event_type: string | null;
    created_on: any | null;
    last_updated_on: any | null;
    capacity: number | null;
    quantity: number | null;
    subtitle: string | null;
    integration: string | null;
    event_store: Object | null;
    theme_color: string;
    theme_color_onlight: string;
    theme_color_ondark: string;
    startDateTime?: string;
    endDateTime?: string;
    metadata?: EventMetadata;
    reservations?: ReservationData[] | null;
    location?: LocationData | null;
    end_location?: LocationData | null;
    attendees?: ProfileData[] | null;
    schedules?: ScheduleData[] | null;
    junctions?: HostData[] | null;
    is_local?: boolean;
    children?: EventData[] | null;
    version?: number;
    type?: Type;
    token?: string | null;
    collisions?: number | null;
};
export declare enum DiffSeverity {
    NoChange = 0,
    CoreContentChange = 1,
    ScheduleToDateTime = 2.1,
    ScheduleChange = 2.2,
    DateTimeToSchedule = 3.1,
    DateChange = 3.2,
    TimeChange = 3.3,
    PlaceChange = 4,
    MetadataChange = 5
}
export declare class Events {
    static fetch: (source: Member, start: Dayjs, end: Dayjs, detailed?: boolean) => Promise<{
        message: string;
        events: EventData[];
    }>;
    static post: (source: Member, values: EventData | EventData[], sharing?: any, actions?: any) => Promise<void>;
    static sortByRemainingDays: (date: Dayjs, a: Event, b: Event) => number;
    static sortByDate: (a: Event, b: Event) => number;
    static sortByTime: (a: Event, b: Event) => number;
    static update: (source: Member, newEvent: Event) => Promise<void>;
    static save: (source: Member, event: Event, commitment?: string) => Promise<void>;
    static get: (source: Member, id: string) => Promise<EventData | null>;
    static search: (query: string, props?: any) => Promise<Event[]>;
    static compare: (target: Event, prev: Event) => DiffSeverity;
    static dayjs(date: number, time: Chronos): dayjs.Dayjs;
    static local_dayjs(date: number, time: Chronos): dayjs.Dayjs;
    static union(events: (Event | null)[]): Event | null;
}
export declare class Event implements Member {
    uuid: string;
    name: string;
    start_time: Chronos | null;
    end_time: Chronos | null;
    date: Dayjs | null;
    end_date: Dayjs | null;
    location_name: string | null;
    location_address: string | null;
    location_place_id: string | null;
    end_location_name: string | null;
    end_location_address: string | null;
    end_location_place_id: string | null;
    cover_img: ImageStub | null;
    icon_img: ImageStub | null;
    wordmark_img: ImageStub | null;
    theme_color: string | null;
    search_vectors: string[] | null;
    link: string | null;
    event_type: string | null;
    created_on: any | null;
    last_updated_on: any | null;
    type: Type;
    capacity: number | null;
    quantity: number | null;
    subtitle: string | null;
    integration: string | null;
    junctions: Map<string, Junction>;
    metadata: EventMetadata;
    isVisible: boolean;
    location?: Location | null;
    attendees?: Profile[] | null;
    schedules?: Schedule[] | null;
    location_id?: string | null;
    children?: Event[] | null;
    token: string | null;
    is_local: boolean;
    collisions: number;
    version: number;
    id(): string;
    getToken: () => string | null;
    getItem: () => this;
    getMin: () => Chronos | null;
    getMax: () => Chronos | null;
    updateHost: (source: Member, junction: HostFactors) => Promise<Event>;
    eject_location_stub: () => LocationData;
    private getSerial;
    copy: (localize?: boolean, reduced?: boolean, rekey?: boolean) => Event;
    eject: (localize?: boolean, reduced?: boolean) => EventData;
    getCoverImageLink(): string | null;
    getSchedulesInFrame: (date?: Dayjs, time?: Chronos) => Schedule[];
    getType: () => Type;
    isOpen: (date?: Dayjs, time?: Chronos) => boolean;
    isOpenDetailed: (date?: Dayjs, time?: Chronos) => {
        date: Dayjs;
        hours: Hours | boolean | null;
        schedule: Schedule | null;
        isOpen: boolean;
        context: string;
        regular: Schedule | null;
        lateNight: boolean;
        metadata: string;
    } | null;
    getAllNonRegularHours(): Schedule[];
    getRegularHours(date?: Dayjs): Schedule | null;
    union: (other: Event | null, date?: Dayjs) => Event;
    pushSchedule(newSchedule: Schedule): void;
    connectTo(other: Member): Junction;
    localize(timezone?: string, globalize?: boolean): Event;
    when(): void;
    globalize(): Event;
    constructor(event?: Partial<EventData>, is_local?: boolean);
    getHostColumnString: () => string;
    getIconPath: (quick?: boolean) => string | null;
}
