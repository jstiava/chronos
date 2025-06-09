"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Profile = void 0;
const junctions_1 = require("./junctions");
const _1 = require(".");
const uuid_1 = require("uuid");
class Profile {
    getUsername() {
        return this.username;
    }
    connectTo(other) {
        const me = this.getHostColumnString();
        const their = other.getHostColumnString();
        const bothEvents = other instanceof Event;
        return new junctions_1.Junction(Object.assign(Object.assign({}, junctions_1.Junction.getHostTemplate()), { [me]: this.id(), [bothEvents ? 'child_event_id' : their]: other.id() }), _1.Type.Profile);
    }
    constructor(item) {
        this.getIconPath = (quick) => {
            var _a;
            // if (quick) {
            //   return this.icon_img?.path_quick || this.icon_img?.path || null;
            // }
            return ((_a = this.icon_img) === null || _a === void 0 ? void 0 : _a.path) || null;
        };
        this.id = () => {
            return this.uuid;
        };
        this.item_id = () => {
            return this.uuid;
        };
        this.item_path = () => {
            return this.username;
        };
        this.getType = () => {
            return _1.Type.Profile;
        };
        this.getHostColumnString = () => {
            return 'profile_id';
        };
        this.getItem = () => {
            return this;
        };
        this.getToken = () => {
            return null;
        };
        // TODO
        this.copy = () => {
            return new Profile(this.eject());
        };
        this.eject = () => {
            let serial = {};
            const data = __rest(this, []);
            // Delete function properties from data
            Object.keys(data).forEach(key => {
                if (typeof data[key] === 'function') {
                    delete data[key];
                }
            });
            Object.assign(serial, data);
            if (!serial) {
                throw Error;
            }
            return Object.assign(Object.assign({}, serial), { junctions: this.junctions ? Array.from(this.junctions.values()) : [] });
        };
        this.type = _1.Type.Profile;
        if (!item) {
            this.uuid = String((0, uuid_1.v4)());
            this.junctions = new Map();
            return this;
        }
        this.metadata = {};
        Object.assign(this, item);
        this.uuid = item.uuid || String((0, uuid_1.v4)());
        this.junctions = new Map();
        if (item.junctions) {
            for (const i of item.junctions) {
                const j = new junctions_1.Junction(i, _1.Type.Profile);
                if (!j) {
                    continue;
                }
                this.junctions.set(j.to.uuid === this.uuid ? j.from.uuid : j.to.uuid, j);
            }
        }
        return this;
    }
}
exports.Profile = Profile;
