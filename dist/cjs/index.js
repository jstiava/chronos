"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberFactory = exports.isMember = exports.Type = exports.Mode = exports.dayjs = void 0;
const events_1 = require("./events");
const groups_1 = require("./groups");
const junctions_1 = require("./junctions");
const locations_1 = require("./locations");
const profiles_1 = require("./profiles");
const axios_1 = __importStar(require("./axios"));
__exportStar(require("./chronos"), exports);
var dayjs_1 = require("./dayjs");
Object.defineProperty(exports, "dayjs", { enumerable: true, get: function () { return __importDefault(dayjs_1).default; } });
__exportStar(require("./events"), exports);
__exportStar(require("./files"), exports);
__exportStar(require("./groups"), exports);
__exportStar(require("./hours"), exports);
__exportStar(require("./junctions"), exports);
__exportStar(require("./locations"), exports);
__exportStar(require("./profiles"), exports);
__exportStar(require("./schedules"), exports);
var Mode;
(function (Mode) {
    Mode["Create"] = "Create";
    Mode["Modify"] = "Modify";
    Mode["Delete"] = "Delete";
    Mode["Copy"] = "Copy";
})(Mode || (exports.Mode = Mode = {}));
var Type;
(function (Type) {
    Type["Event"] = "Event";
    Type["Location"] = "Location";
    Type["Profile"] = "Profile";
    Type["Group"] = "Group";
    Type["Custom"] = "Custom";
    Type["Schedule"] = "Schedule";
})(Type || (exports.Type = Type = {}));
exports.isMember = [groups_1.Group, locations_1.Location, events_1.Event, profiles_1.Profile];
class MemberFactory {
    static connect(that, other) {
        const me = that.getHostColumnString();
        const their = other.getHostColumnString();
        return new junctions_1.Junction(Object.assign(Object.assign({}, junctions_1.Junction.getHostTemplate()), { [me]: that.id(), [their]: other.id() }), that.type);
    }
    static delete(source, items, type) {
        return __awaiter(this, void 0, void 0, function* () {
            yield axios_1.default.delete(`api/v1/${type.toLowerCase()}s`, {
                data: {
                    isUser: source instanceof profiles_1.Profile,
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
            yield axios_1.default.get(`api/v1/${that.type.toLowerCase()}s/metadata`, {
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
            yield axios_1.default.post(axios_1.API.GET_BASE_TOKEN, {
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
            return yield axios_1.default.post(axios_1.API.ACQUIRE_BASE, {
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
                return new events_1.Event(...args);
            case Type.Group:
                return new groups_1.Group(...args);
            // case Type.Location:
            //     return new Location(...args);
            case Type.Profile:
                return new profiles_1.Profile(...args);
            default:
                throw new Error("Unknown shape type");
        }
    }
    static isMember(target) {
        return exports.isMember.some(cls => target instanceof cls);
    }
}
exports.MemberFactory = MemberFactory;
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
