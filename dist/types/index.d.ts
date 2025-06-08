import { EventData, Event } from './events';
import { GroupData, Group } from './groups';
import { Junction, JunctionData } from './junctions';
import { LocationData } from './locations';
import { Profile } from './profiles';
import { ImageStub } from './files';
import dayjs, { Dayjs } from './dayjs';
export * from './chronos';
export { dayjs, Dayjs };
export * from './events';
export * from './files';
export * from './groups';
export * from './hours';
export * from './junctions';
export * from './locations';
export * from './profiles';
export * from './schedules';
export declare enum Mode {
    Create = "Create",
    Modify = "Modify",
    Delete = "Delete",
    Copy = "Copy"
}
export declare enum Type {
    Event = "Event",
    Location = "Location",
    Profile = "Profile",
    Group = "Group",
    Custom = "Custom",
    Schedule = "Schedule"
}
export type MemberData = GroupData & EventData & LocationData;
export interface Member {
    integration?: string | null;
    uuid: string;
    name: string;
    theme_color: string | null;
    type: Type;
    metadata: any;
    junctions: Map<string, JunctionData>;
    id: () => string;
    eject: () => any;
    copy: (localize?: boolean, reduced?: boolean, rekey?: boolean) => Member;
    getItem: () => Member;
    getIconPath: (quick?: boolean) => string | null;
    getHostColumnString: () => string;
    getType: () => Type;
    token?: string | null;
    icon_img?: ImageStub | null;
}
export declare const isMember: Function[];
export declare class MemberFactory {
    static connect(that: Member, other: Member): Junction;
    static delete(source: Member, items: string[], type: Type): Promise<void>;
    static getToken: (that: Member) => string | null | undefined;
    static getMetadata(that: Event): Promise<Event>;
    static getMetadata(that: Group): Promise<Group>;
    static getMetadata(that: Profile): Promise<Profile>;
    static fetchMetadata(that: Member): Promise<void>;
    static login(that: Member, source?: Member, acquire?: boolean): Promise<string | null>;
    static acquire(that: Member, source?: Member): Promise<{
        isAcquired: boolean;
        message: string;
    }>;
    static collect_media: (self: MemberData | Member | null) => ImageStub[];
    static create(type: Type, ...args: any[]): Member;
    static isMember(target: any): boolean;
}
