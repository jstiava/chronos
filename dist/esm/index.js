var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Event } from './events';
import { Group } from './groups';
import { Junction } from './junctions';
import { Location } from './locations';
import { Profile } from './profiles';
import axios, { API } from './axios';
export * from './chronos';
export { default as dayjs } from './dayjs';
export * from './events';
export * from './files';
export * from './groups';
export * from './hours';
export * from './junctions';
export * from './locations';
export * from './profiles';
export * from './schedules';
export var Mode;
(function (Mode) {
    Mode["Create"] = "Create";
    Mode["Modify"] = "Modify";
    Mode["Delete"] = "Delete";
    Mode["Copy"] = "Copy";
})(Mode || (Mode = {}));
export var Type;
(function (Type) {
    Type["Event"] = "Event";
    Type["Location"] = "Location";
    Type["Profile"] = "Profile";
    Type["Group"] = "Group";
    Type["Custom"] = "Custom";
    Type["Schedule"] = "Schedule";
})(Type || (Type = {}));
export const isMember = [Group, Location, Event, Profile];
export class MemberFactory {
    static connect(that, other) {
        const me = that.getHostColumnString();
        const their = other.getHostColumnString();
        return new Junction(Object.assign(Object.assign({}, Junction.getHostTemplate()), { [me]: that.id(), [their]: other.id() }), that.type);
    }
    static delete(source, items, type) {
        return __awaiter(this, void 0, void 0, function* () {
            yield axios.delete(`api/v1/${type.toLowerCase()}s`, {
                data: {
                    isUser: source instanceof Profile,
                    [`${type.toLowerCase().toString()}s`]: items,
                    source: MemberFactory.getToken(source),
                }
            })
                .then(res => {
                return true;
            })
                .catch(error => {
                return false;
            });
        });
    }
    // static async getMetadata(that: Location): Promise<Location>;
    static getMetadata(that) {
        return __awaiter(this, void 0, void 0, function* () {
            if (that.metadata.isFetched)
                return that;
            yield this.fetchMetadata(that);
            return that;
        });
    }
    static fetchMetadata(that) {
        return __awaiter(this, void 0, void 0, function* () {
            if (that.metadata && that.metadata.isFetched) {
                return;
            }
            yield axios.get(`api/v1/${that.type.toLowerCase()}s/metadata`, {
                params: {
                    uuid: that.id(),
                    type: that.type
                },
            })
                .then(res => {
                const cleaned = res.data.results;
                if ('data' in res.data.results) {
                    cleaned.data = JSON.parse(res.data.results.data);
                }
                Object.assign(that.metadata, cleaned);
                that.metadata.isFetched = true;
            })
                .catch(error => {
                console.log(error);
            });
        });
    }
    static login(that_1, source_1) {
        return __awaiter(this, arguments, void 0, function* (that, source, acquire = false) {
            if (that.token)
                return that.token;
            yield axios.post(API.GET_BASE_TOKEN, {
                type: that.type,
                uuid: that.uuid,
                source: source ? this.getToken(source) : this.getToken(that) || null,
                acquire
            })
                .then((res) => {
                that.token = res.data.token;
                return res.data.token;
            })
                .catch((err) => {
                console.log("Failed to login.");
                throw Error();
            });
            return null;
        });
    }
    static acquire(that, source) {
        return __awaiter(this, void 0, void 0, function* () {
            if (that.type != Type.Event) {
                return {
                    isAcquired: true,
                    message: "Not protected by lock yet."
                };
            }
            if (!that.token) {
                const isAcquired = yield this.login(that, source, true)
                    .then(res => {
                    return true;
                })
                    .catch(err => {
                    return false;
                });
                return {
                    isAcquired,
                    message: "Success"
                };
            }
            return yield axios.post(API.ACQUIRE_BASE, {
                type: that.type,
                uuid: that.uuid,
                source: source ? this.getToken(source) : null
            })
                .then((res) => {
                return res.data;
            })
                .catch((err) => {
                return err.response.data;
            });
        });
    }
    static create(type, ...args) {
        switch (type) {
            case Type.Event:
                return new Event(...args);
            case Type.Group:
                return new Group(...args);
            // case Type.Location:
            //     return new Location(...args);
            case Type.Profile:
                return new Profile(...args);
            default:
                throw new Error("Unknown shape type");
        }
    }
    static isMember(target) {
        return isMember.some(cls => target instanceof cls);
    }
}
MemberFactory.getToken = (that) => {
    return that.token;
};
MemberFactory.collect_media = (self) => {
    if (!self || !('cover_img' in self)) {
        return [];
    }
    let result = [];
    if ('cover_img' in self && self.cover_img) {
        result.push(self.cover_img);
    }
    if ('icon_img' in self && self.icon_img) {
        result.push(self.icon_img);
    }
    if ('wordmark_img' in self && self.wordmark_img) {
        result.push(self.wordmark_img);
    }
    return result;
};
