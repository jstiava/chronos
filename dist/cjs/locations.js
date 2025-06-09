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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Location = exports.Locations = exports.LocationDiffSeverity = void 0;
const axios_1 = __importStar(require("./axios"));
// import { hashObject } from './events';
const profiles_1 = require("./profiles");
const _1 = require(".");
const _2 = require(".");
const junctions_1 = require("./junctions");
const uuid_1 = require("uuid");
var LocationDiffSeverity;
(function (LocationDiffSeverity) {
    LocationDiffSeverity[LocationDiffSeverity["NoChange"] = 0] = "NoChange";
    LocationDiffSeverity[LocationDiffSeverity["MetadataChange"] = 1] = "MetadataChange";
    LocationDiffSeverity[LocationDiffSeverity["PlaceChange"] = 2] = "PlaceChange";
})(LocationDiffSeverity || (exports.LocationDiffSeverity = LocationDiffSeverity = {}));
class Locations {
}
exports.Locations = Locations;
_a = Locations;
Locations.fetch = (source) => __awaiter(void 0, void 0, void 0, function* () {
    return yield axios_1.default.get(axios_1.API.GET_LOCATIONS, {
        params: {
            isUser: source instanceof profiles_1.Profile,
            source: _2.MemberFactory.getToken(source)
        },
    })
        .then(res => {
        return res.data.locations.map((item) => {
            return new Location(item);
        });
    })
        .catch(err => {
        throw err;
    });
});
Locations.post = (source, newLocation) => __awaiter(void 0, void 0, void 0, function* () {
    return yield axios_1.default
        .post(axios_1.API.POST_LOCATION, {
        isUser: source instanceof profiles_1.Profile,
        source: _2.MemberFactory.getToken(source),
        location: newLocation
    })
        .then(res => {
        return;
    })
        .catch(error => {
        console.log(error);
        throw Error("Failed to create");
    });
});
Locations.update = (source, newLocation) => __awaiter(void 0, void 0, void 0, function* () {
    yield axios_1.default
        .patch(axios_1.API.UPDATE_LOCATION, {
        isUser: source instanceof profiles_1.Profile,
        source: _2.MemberFactory.getToken(source),
        uuid: newLocation.uuid,
        location: newLocation.eject(),
    })
        .then(res => {
        return;
    })
        .catch(error => {
        throw Error("Failed to create");
    });
    return;
});
Locations.delete = (source, ids) => __awaiter(void 0, void 0, void 0, function* () {
    return yield axios_1.default
        .delete(axios_1.API.DELETE_LOCATIONS, {
        data: {
            isUser: source instanceof profiles_1.Profile,
            locations: ids,
            source: _2.MemberFactory.getToken(source),
        },
    })
        .then(res => {
        return;
    })
        .catch(err => {
        return;
    });
});
Locations.get = (source, uuid) => __awaiter(void 0, void 0, void 0, function* () {
    return yield axios_1.default
        .get('/api/v3/locations', {
        params: {
            source: _2.MemberFactory.getToken(source),
            uuid,
        },
    })
        .then(res => {
        return res.data.location;
    })
        .catch(err => {
        console.log(err);
        return null;
    });
});
Locations.search = (query, props) => __awaiter(void 0, void 0, void 0, function* () {
    return;
});
class Location {
    getUsername() {
        return this.uuid;
    }
    constructor(item) {
        this.id = () => {
            return this.uuid;
        };
        this.getHostColumnString = () => {
            return 'location_id';
        };
        this.getItem = () => {
            return this;
        };
        this.item_id = () => {
            return this.uuid;
        };
        this.getToken = () => {
            return this.token;
        };
        this.getIconPath = (quick = false) => {
            return null;
        };
        this.copy = () => {
            return this.eject();
        };
        this.eject = () => {
            let serial = {};
            const _b = this, { created_on, last_updated_on } = _b, data = __rest(_b, ["created_on", "last_updated_on"]);
            Object.keys(data).forEach(key => {
                if (typeof data[key] === 'function') {
                    delete data[key];
                }
            });
            Object.assign(serial, data);
            return Object.assign(Object.assign({}, serial), { junctions: this.junctions ? Array.from(this.junctions.values()).map(j => j.eject()) : [], type: _1.Type.Location });
        };
        this.getType = () => {
            return _1.Type.Location;
        };
        this.link = () => {
            return `https://www.google.com/maps/search/?api=1&query=${this.address || "none"}&query_place_id=${this.place_id}`;
        };
        this.createLocationLink = () => {
            return `https://www.google.com/maps/search/?api=1&query=${this.address || "none"}&query_place_id=${this.place_id}`;
        };
        this.type = _1.Type.Location;
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
                const j = new junctions_1.Junction(i, _1.Type.Location);
                if (!j) {
                    continue;
                }
                this.junctions.set(j.to.uuid === this.uuid ? j.from.uuid : j.to.uuid, j);
            }
        }
        return this;
    }
}
exports.Location = Location;
Location.createLocationLink = (place_id, address) => {
    return `https://www.google.com/maps/search/?api=1&query=${address}&query_place_id=${place_id}`;
};
