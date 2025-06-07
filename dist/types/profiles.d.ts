import { HostData, Junction, Membership } from './junctions';
import { ImageStub } from './files';
import { Type } from '.';
import { Member } from '.';
export type ProfileData = any & {
    passkey?: string | null;
    membership?: Membership | null;
    type?: Type;
    junctions?: HostData[] | null;
};
export declare class Profile implements Member {
    uuid: string;
    name: string;
    nickname: string;
    username: string;
    email: string;
    phone: string;
    theme_color: string;
    valid: boolean;
    icon_img: ImageStub | null;
    membership: Membership | null;
    type: Type;
    junctions: Map<string, Junction>;
    metadata: any;
    getIconPath: (quick?: boolean) => string | null;
    id: () => string;
    item_id: () => string;
    item_path: () => string;
    getType: () => Type;
    getHostColumnString: () => string;
    getItem: () => this;
    getUsername(): string;
    getToken: () => null;
    connectTo(other: Member): Junction;
    copy: () => Profile;
    eject: () => ProfileData;
    constructor(item?: ProfileData);
}
