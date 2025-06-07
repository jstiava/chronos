import { Type } from '.';
import { ImageStub } from './files';
import { Member } from '.';
import { Junction, JunctionData } from './junctions';
export type LocationMetadata = {
    isFetched?: boolean | null;
    description?: string | null;
    files?: string[];
};
export type LocationData = any & {
    junctions?: JunctionData[] | null;
    metadata?: LocationMetadata;
    token?: string;
};
export declare enum LocationDiffSeverity {
    NoChange = 0,
    MetadataChange = 1,
    PlaceChange = 2
}
export declare class Locations {
    static fetch: (source: Member) => Promise<Location[]>;
    static post: (source: Member, newLocation: LocationData) => Promise<void>;
    static update: (source: Member, newLocation: Location) => Promise<void>;
    static delete: (source: Member, ids: string[]) => Promise<void>;
    static get: (source: Member, uuid: string) => Promise<LocationData | LocationData[]>;
    static search: (query: string, props?: any) => Promise<void>;
}
export interface VectorMap {
    uuid: string;
    location_id: string;
    source_id: string;
    file: string;
}
export interface VectorLayer {
    uuid: string;
    map_id: string;
    event_id: string;
    layer: string;
    left: number;
    top: number;
}
export declare class Location implements Member {
    uuid: string;
    name: string;
    place_name: string | null;
    place_id: string | null;
    address: string | null;
    cover_img: ImageStub | null;
    icon_img: ImageStub | null;
    wordmark_img: ImageStub | null;
    theme_color: string | null;
    map: VectorMap | null;
    type: Type;
    junctions: Map<string, Junction>;
    metadata: LocationMetadata;
    token: string | null;
    id: () => string;
    getUsername(): string;
    getHostColumnString: () => string;
    getItem: () => this;
    item_id: () => string;
    getToken: () => string | null;
    getIconPath: (quick?: boolean) => string | null;
    copy: () => any;
    eject: () => LocationData;
    getType: () => Type;
    link: () => string;
    createLocationLink: () => string;
    static createLocationLink: (place_id: string, address: string) => string;
    constructor(item?: Partial<LocationData>);
}
