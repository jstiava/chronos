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
exports.Group = void 0;
const _1 = require(".");
const uuid_1 = require("uuid");
const _2 = require(".");
class Group {
    constructor(item) {
        this.getHostColumnString = () => {
            return 'group_id';
        };
        this.getType = () => {
            return _2.Type.Group;
        };
        this.getItem = () => {
            return this;
        };
        this.getIconPath = (quick = false) => {
            var _a, _b, _c;
            if (!this.icon_img && this.cover_img) {
                return this.cover_img.path || null;
            }
            if (quick) {
                return ((_a = this.icon_img) === null || _a === void 0 ? void 0 : _a.path_quick) || ((_b = this.icon_img) === null || _b === void 0 ? void 0 : _b.path) || null;
            }
            return ((_c = this.icon_img) === null || _c === void 0 ? void 0 : _c.path) || null;
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
        this.copy = () => {
            return new Group(this.eject());
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
        this.type = _2.Type.Group;
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
                const j = new _1.Junction(i, _2.Type.Group);
                if (!j) {
                    continue;
                }
                try {
                    this.junctions.set(j.to.uuid === this.uuid ? `${j.from.uuid}_${j.directionality}` : `${j.to.uuid}_${j.directionality}`, j);
                }
                catch (err) {
                    console.log({
                        err,
                        j
                    });
                }
            }
        }
        return this;
    }
    getUsername() {
        return this.username;
    }
    connectTo(other) {
        const me = this.getHostColumnString();
        const their = other.getHostColumnString();
        return new _1.Junction(Object.assign(Object.assign({}, _1.Junction.getHostTemplate()), { [me]: this.id(), [their]: other.id() }), _2.Type.Group);
    }
}
exports.Group = Group;
