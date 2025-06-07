import { Type } from '.';
export declare enum JunctionStatus {
    Accepted = "accepted",
    Requested = "requested",
    Denied = "denied",
    Invited = "invited"
}
export type AttendeeData = any;
export interface HostFactors {
    status?: JunctionStatus;
    is_public?: boolean;
    is_expanded?: boolean;
    is_shown?: boolean;
}
export type Membership = any;
export type HostData = any;
export type JunctionTables = any;
export type ProfileMembershipData = {
    membership: Membership;
    type?: Type;
};
export declare const getType: (item: any) => Type | null;
export interface Pointer {
    type: Type;
    value: string;
}
export type Directionalities = "bidirectional" | "from_group_to" | "from_profile_to" | "from_event_to" | "from_location_to" | "from_cert_to" | "from_child_event_to" | "from_child_group_to" | "from_child_location_to";
export declare function typeToField(type: Type): string;
export declare function typeToDirectionality(type: Type, isChild?: boolean): Directionalities;
export declare function directionalityToType(directionality: Directionalities): Type;
export interface JunctionStub {
    uuid: string;
    type: Type;
    column: string;
    directionality: Directionalities;
}
export type JunctionData = Partial<HostData> & Partial<Membership> & Partial<AttendeeData>;
export declare class JunctionBuilder {
    private parent;
    private child;
    private directionality;
    private reverseDirectionality;
    private data;
    private reverse;
    private isReversed;
    from(target: Pointer): this;
    to(target: Pointer): this;
    fromParentToChild(): this;
    fromChildToParent(): this;
    syncWithRefreshTokenExpiry(): this;
    designate(value: {
        id?: string;
        type?: string;
        external_child_webhook_resource_id?: string;
    }): this;
    denyAll(): this;
    allowAll(): this;
    setStatus(value: 'requested' | 'accepted'): this;
    isPublic(): this;
    isPrivate(): this;
    build(type: 'hosts'): [JunctionData, JunctionData];
    build(type: 'memberships'): [Membership, Membership];
}
export declare class Junction {
    uuid?: string;
    group_id?: string | null;
    profile_id?: string | null;
    location_id?: string | null;
    event_id?: string | null;
    child_event_id?: string | null;
    certificate_id?: string | null;
    certificate_wild_card?: boolean;
    directionality?: string;
    status?: JunctionStatus;
    order_index?: number | null;
    is_shown?: boolean;
    is_public?: boolean;
    created_on?: Date;
    last_updated_on?: Date;
    a_uuid?: string | null;
    a_profile_id?: string | null;
    a_cert_wild_card?: boolean | null;
    a_cert_id?: string | null;
    from: JunctionStub;
    to: JunctionStub;
    eject(): JunctionData;
    static toPointer: (data: {
        type: Type;
        uuid: string;
        [key: string]: any;
    }) => Pointer;
    static inspect: (data: Partial<JunctionData>) => string;
    static getMembershipTemplate: (key?: string | null, parent?: Pointer, child?: Pointer, directionIsParentToChild?: boolean) => Membership;
    /**
     *
     * @param key if null, will rekey
     * @param parent
     * @param child
     * @param directionIsParentToChild
     * @returns
     */
    static getHostTemplate: (key?: string | null, parent?: Pointer, child?: Pointer, directionIsParentToChild?: boolean) => HostData;
    static resolveType: (item: (HostData | Membership) & {
        [key: string]: any;
    }, excludeType: Type) => {
        uuid: string;
        type: Type;
        column: string;
        directionality: "bidirectional" | "from_group_to" | "from_profile_to" | "from_event_to" | "from_location_to" | "from_cert_to" | "from_child_event_to";
    };
    static getAttendeeTemplate: (key?: string | null, profile_id?: string, event_id?: string, directionIsProfileToEvent?: boolean) => AttendeeData;
    constructor(item: (HostData | Membership | AttendeeData) & {
        [key: string]: any;
    }, excludeType: Type);
}
