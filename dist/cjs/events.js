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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = exports.Events = exports.DiffSeverity = void 0;
exports.isEventCalendar = isEventCalendar;
exports.isMultiDayEvent = isMultiDayEvent;
exports.isAllSingleDay = isAllSingleDay;
exports.isMoment = isMoment;
exports.isSingleTimeEvent = isSingleTimeEvent;
exports.isNotScheduled = isNotScheduled;
exports.isScheduled = isScheduled;
const chronos_1 = require("./chronos");
const dayjs_1 = __importDefault(require("./dayjs"));
const uuid_1 = require("uuid");
const _1 = require(".");
const _2 = require(".");
const junctions_1 = require("./junctions");
const profiles_1 = require("./profiles");
const schedules_1 = require("./schedules");
const axios_1 = __importStar(require("./axios"));
// export const hashObject = (obj: any): string => {
//   return createHash('sha256')
//     .update(JSON.stringify(obj))
//     .digest('hex')
// }
function isEventCalendar(event) {
    return (!event.date || !event.end_date) && !event.start_time;
}
function isMultiDayEvent(event) {
    return dayjs_1.default.isDayjs(event.date) && dayjs_1.default.isDayjs(event.end_date);
}
function isAllSingleDay(event) {
    return isMultiDayEvent(event) && (event.date.isSame(event.end_date));
}
function isMoment(event) {
    return dayjs_1.default.isDayjs(event.date) && (event.start_time instanceof chronos_1.Chronos && !event.end_time);
}
function isSingleTimeEvent(event) {
    return dayjs_1.default.isDayjs(event.date) && (event.start_time instanceof chronos_1.Chronos && event.end_time instanceof chronos_1.Chronos);
}
function isNotScheduled(event) {
    return dayjs_1.default.isDayjs(event.date) && event.start_time instanceof chronos_1.Chronos;
}
function isScheduled(event) {
    return 'schedules' in event && event.schedules != null;
}
var DiffSeverity;
(function (DiffSeverity) {
    DiffSeverity[DiffSeverity["NoChange"] = 0] = "NoChange";
    DiffSeverity[DiffSeverity["CoreContentChange"] = 1] = "CoreContentChange";
    DiffSeverity[DiffSeverity["ScheduleToDateTime"] = 2.1] = "ScheduleToDateTime";
    DiffSeverity[DiffSeverity["ScheduleChange"] = 2.2] = "ScheduleChange";
    DiffSeverity[DiffSeverity["DateTimeToSchedule"] = 3.1] = "DateTimeToSchedule";
    DiffSeverity[DiffSeverity["DateChange"] = 3.2] = "DateChange";
    DiffSeverity[DiffSeverity["TimeChange"] = 3.3] = "TimeChange";
    DiffSeverity[DiffSeverity["PlaceChange"] = 4] = "PlaceChange";
    DiffSeverity[DiffSeverity["MetadataChange"] = 5] = "MetadataChange";
})(DiffSeverity || (exports.DiffSeverity = DiffSeverity = {}));
class Events {
    static dayjs(date, time) {
        return dayjs_1.default.utc(String(date)).set('hour', time.getHour()).set('minute', time.getMinute());
    }
    static local_dayjs(date, time) {
        return (0, dayjs_1.default)(String(date)).set('hour', time.getHour()).set('minute', time.getMinute());
    }
    static union(events) {
        if (!events) {
            return null;
        }
        console.log({
            "message": "union",
            "events": events.map(x => {
                if (!x)
                    return null;
                return x.name;
            })
        });
        if (events.length === 1) {
            return events[0];
        }
        else if (events.length === 2) {
            if (events[0]) {
                return events[0].union(events[1]);
            }
            else if (events[1]) {
                return events[1].union(events[0]);
            }
            else {
                return null;
            }
        }
        return _a.union([_a.union(events.slice(0, events.length / 2)),
            _a.union(events.slice(events.length / 2, events.length))]);
    }
}
exports.Events = Events;
_a = Events;
Events.fetch = (source_1, start_1, end_1, ...args_1) => __awaiter(void 0, [source_1, start_1, end_1, ...args_1], void 0, function* (source, start, end, detailed = false) {
    return yield axios_1.default.get(`api/v1/events`, {
        params: {
            type: source.getType(),
            id: source.id(),
            isUser: source instanceof profiles_1.Profile,
            source: _2.MemberFactory.getToken(source),
            start: start.yyyymmdd(),
            end: end.yyyymmdd(),
            detailed
        },
    })
        .then((res) => {
        return res.data;
    })
        .catch((err) => {
        throw err;
    });
});
Events.post = (source, values, sharing, actions) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(values instanceof Array)) {
        values = [values];
    }
    return yield axios_1.default
        .post(axios_1.API.POST_EVENT, {
        isUser: source instanceof profiles_1.Profile,
        source: _2.MemberFactory.getToken(source),
        events: values,
        sharing,
        actions
    })
        .then((res) => {
        if (res.data.count != values.length) {
            throw Error("Not all events were created.");
        }
        return;
    })
        .catch((error) => {
        throw Error;
    });
});
Events.sortByRemainingDays = (date, a, b) => {
    try {
        if (!a.date || !b.date) {
            if (!a.date) {
                if (!b.date) {
                    return 0;
                }
                return 1;
            }
            return -1;
        }
        const aRange = a.end_date ? a.end_date.diff(date, 'd') : 0;
        const bRange = b.end_date ? b.end_date.diff(date, 'd') : 0;
        return bRange - aRange;
    }
    catch (err) {
        return 0;
    }
};
Events.sortByDate = (a, b) => {
    if (!a && !b)
        return 0;
    if (!a)
        return 1;
    if (!b)
        return -1;
    const aDate = a.date;
    const bDate = b.date;
    if (!aDate && !bDate) {
        return 0;
    }
    if (!aDate) {
        return 1;
    }
    if (!bDate) {
        return -1;
    }
    const diff = aDate.yyyymmdd() - bDate.yyyymmdd();
    if (diff === 0) {
        return 0;
    }
    return diff;
};
Events.sortByTime = (a, b) => {
    if (!a && !b)
        return 0;
    if (!a)
        return 1;
    if (!b)
        return -1;
    const aMin = a.getMin();
    const bMin = b.getMin();
    if (aMin && bMin) {
        return aMin.getHMN() - bMin.getHMN();
    }
    if (aMin) {
        return -1;
    }
    if (bMin) {
        return 1;
    }
    if (a.date || b.date) {
        return 0;
    }
    return 0;
};
Events.update = (source, newEvent) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(newEvent);
    try {
        yield axios_1.default
            .patch(axios_1.API.UPDATE_EVENT, {
            isUser: source instanceof profiles_1.Profile,
            source: _2.MemberFactory.getToken(source),
            uuid: newEvent.uuid,
            event: newEvent.eject(),
        })
            .then((res) => {
            return;
        })
            .catch((err) => {
            console.log(err);
            throw Error("Something went wrong that prevented an event update.");
        });
    }
    catch (err) {
        console.log(err);
        throw Error("Something went wrong that prevented a message to update the event.");
    }
});
Events.save = (source_1, event_1, ...args_1) => __awaiter(void 0, [source_1, event_1, ...args_1], void 0, function* (source, event, commitment = "save") {
    yield axios_1.default.post(axios_1.API.SAVE_EVENT, {
        isUser: source instanceof profiles_1.Profile,
        uuid: event.uuid,
        attendee_type: commitment
    })
        .then((res) => {
        return;
    });
});
Events.get = (source, id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield axios_1.default
        .get(`api/v1/events`, {
        params: {
            event_id: id,
            source: _2.MemberFactory.getToken(source),
            isUser: source instanceof profiles_1.Profile
        },
    })
        .then((res) => {
        if (!res.data.event) {
            return null;
        }
        return res.data.event;
    })
        .catch((err) => {
        console.log({
            message: "Events API get",
            err
        });
        return null;
    });
});
Events.search = (query, props) => __awaiter(void 0, void 0, void 0, function* () {
    return yield axios_1.default.get(axios_1.API.SEARCH_EVENTS, {
        params: {
            q: query
        }
    })
        .then((res) => {
        let searchResults = [];
        for (const event of res.data.candidates) {
            searchResults.push(new Event(event).localize());
        }
        return searchResults;
    })
        .catch((err) => {
        console.log(err);
        return [];
    });
});
Events.compare = (target, prev) => {
    if (!prev.date && target.date) {
        return DiffSeverity.ScheduleToDateTime;
    }
    if (prev.date && !target.date) {
        return DiffSeverity.DateTimeToSchedule;
    }
    if (!prev.end_date && target.end_date) {
        return DiffSeverity.DateTimeToSchedule;
    }
    if (prev.end_date && !target.end_date) {
        return DiffSeverity.ScheduleToDateTime;
    }
    if (prev.end_date && prev.end_date) {
        return DiffSeverity.ScheduleChange;
    }
    if (prev.date && target.date) {
        return DiffSeverity.DateChange;
    }
    if (!prev.date && !target.date) {
        return DiffSeverity.ScheduleChange;
    }
    if (prev.location_place_id != target.location_place_id) {
        return DiffSeverity.PlaceChange;
    }
    return DiffSeverity.NoChange;
};
class Event {
    id() {
        return this.uuid;
    }
    getCoverImageLink() {
        return this.cover_img ? this.cover_img.path : null;
    }
    getAllNonRegularHours() {
        if (!this.schedules) {
            return [];
        }
        const filtered = this.schedules.filter(x => x.schedule_type != "regular");
        return filtered;
    }
    getRegularHours(date = (0, dayjs_1.default)()) {
        if (!this.schedules) {
            return null;
        }
        const inFrame = this.getSchedulesInFrame(date);
        return inFrame.find(x => x.schedule_type === "regular") || null;
    }
    pushSchedule(newSchedule) {
        if (this.is_local != newSchedule.is_local) {
            this.is_local ? newSchedule.localize() : newSchedule.globalize();
        }
        if (this.schedules) {
            const schedules = this.schedules.filter(x => x.uuid != newSchedule.uuid);
            const newLength = schedules.push(newSchedule);
            if (schedules.length > 1) {
                const rankedSchedules = schedules_1.Schedule.rank(schedules);
                console.log(rankedSchedules);
                this.schedules = rankedSchedules;
            }
            else {
                this.schedules = schedules;
            }
        }
        else {
            this.schedules = [newSchedule];
        }
    }
    connectTo(other) {
        const me = this.getHostColumnString();
        const their = other.getHostColumnString();
        const bothEvents = other instanceof Event;
        return new junctions_1.Junction(Object.assign(Object.assign({}, junctions_1.Junction.getHostTemplate()), { [me]: this.id(), [bothEvents ? 'child_event_id' : their]: other.id() }), _1.Type.Event);
    }
    localize(timezone = 'America/Chicago', globalize = false) {
        if (this.is_local === !globalize) {
            console.log({
                globalize,
                message: "Early return"
            });
            return this;
        }
        this.is_local = globalize ? false : true;
        if (isMultiDayEvent(this) || isAllSingleDay(this)) {
            this.date = globalize
                ? (0, dayjs_1.default)(this.date).utc()
                : (0, dayjs_1.default)(this.date).tz(timezone, true);
            this.end_date = globalize ? dayjs_1.default.utc(this.end_date) : dayjs_1.default.utc(this.end_date).tz(timezone, true);
            return this;
        }
        const dateBeforeConversion = this.date;
        if (this.date) {
            this.date = globalize
                ? (0, dayjs_1.default)(this.date).utc()
                : (0, dayjs_1.default)(this.date).tz(timezone);
            if (this.end_date) {
                this.end_date = globalize ? dayjs_1.default.utc(this.end_date) : dayjs_1.default.utc(this.end_date).tz(timezone);
            }
        }
        if (this.start_time) {
            if (this.date) {
                this.start_time = this.date.toChronos();
            }
            if (this.end_time) {
                const end_hour = this.end_time.getHour();
                const end_minute = this.end_time.getMinute();
                if (this.date && dateBeforeConversion) {
                    const endDateWithTime = dateBeforeConversion.set('hour', end_hour).set('minute', end_minute);
                    const finalConverted = globalize
                        ? (0, dayjs_1.default)(endDateWithTime).utc()
                        : (0, dayjs_1.default)(endDateWithTime).tz(timezone);
                    this.end_time = finalConverted.toChronos();
                }
            }
        }
        this.junctions && this.junctions.forEach((r) => {
            if (r instanceof Event) {
                globalize ? r.globalize() : r.localize();
            }
        });
        this.schedules && this.schedules.forEach((s) => {
            globalize ? s.globalize() : s.localize();
        });
        return this;
    }
    when() {
        console.log({
            date: this.date && this.date.yyyymmdd(),
            start_time: this.start_time && this.start_time.getHMN(),
            end_date: this.end_date && this.end_date.yyyymmdd(),
            end_time: this.end_time && this.end_time.getHMN(),
            is_local: this.is_local
        });
    }
    globalize() {
        return this.localize(undefined, true);
    }
    constructor(event, is_local = false) {
        var _b;
        this.getToken = () => {
            return this.token;
        };
        this.getItem = () => {
            return this;
        };
        this.getMin = () => {
            return this.start_time;
        };
        this.getMax = () => {
            return this.end_time;
        };
        this.updateHost = (source, junction) => __awaiter(this, void 0, void 0, function* () {
            const copy = this;
            return yield axios_1.default.patch(axios_1.API.CHANGE_EVENT_STATUS, {
                source: _2.MemberFactory.getToken(this),
                uuid: this.id(),
                data: {
                    junction
                },
                type: _1.Type.Event
            })
                .then((res) => {
                copy.junctions.set(source.id(), new junctions_1.Junction(res.data.event.junction, _1.Type.Event));
                return copy;
            })
                .catch((err) => {
                throw Error("Something went wrong.");
            });
        });
        this.eject_location_stub = () => {
            return {
                uuid: String((0, uuid_1.v4)()),
                name: this.location_name || "",
                place_name: this.location_name || "",
                place_id: this.location_place_id || "",
                address: this.location_address || "",
                junctions: null,
                search_vectors: "",
                metadata: {},
                cover_img: null,
                icon_img: null,
                wordmark_img: null,
                theme_color: this.theme_color || null
            };
        };
        this.getSerial = () => {
            let serial = {};
            const _b = this, { token, is_local, collisions, parents, created_on, last_updated_on } = _b, data = __rest(_b, ["token", "is_local", "collisions", "parents", "created_on", "last_updated_on"]);
            // Delete function properties from data
            Object.keys(data).forEach(key => {
                if (typeof data[key] === 'function') {
                    delete data[key];
                }
            });
            Object.assign(serial, data);
            return serial;
        };
        this.copy = (localize = false, reduced = false, rekey = false) => {
            const data = __rest(this, []);
            Object.keys(data).forEach(key => {
                if (typeof data[key] === 'function') {
                    delete data[key];
                }
            });
            return new Event(Object.assign(Object.assign({}, data), { uuid: rekey ? String((0, uuid_1.v4)()) : data.uuid, start_time: data.start_time ? String(data.start_time.getHMN().toFixed(3)) : null, end_time: data.end_time ? String(data.end_time.getHMN().toFixed(3)) : null, date: data.date ? Number(data.date.yyyymmdd()) : null, end_date: data.end_date ? Number(data.end_date.yyyymmdd()) : null, junctions: this.junctions ? Array.from(this.junctions.values()) : [], attendees: this.attendees ? this.attendees.map((a) => a.copy()) : null, schedules: data.schedules ? data.schedules.map((s) => s.copy()) : null, type: _1.Type.Event }));
        };
        this.eject = (localize = false, reduced = false) => {
            const serial = this.getSerial();
            if (!serial) {
                throw Error;
            }
            if (localize && !this.is_local) {
                serial.start_time = this.start_time ? this.start_time.add((-1) * (0, dayjs_1.default)().getTimezoneOffsetInHours()) : null;
                serial.end_time = this.end_time ? this.end_time.add((-1) * (0, dayjs_1.default)().getTimezoneOffsetInHours()) : null;
                serial.date = this.date ? this.date.add((-1) * (0, dayjs_1.default)().getTimezoneOffsetInHours(), 'hour') : null;
                serial.end_date = this.end_date ? this.end_date.add((-1) * (0, dayjs_1.default)().getTimezoneOffsetInHours(), 'hour') : null;
            }
            try {
                return Object.assign(Object.assign({}, serial), { start_time: serial.start_time ? String(serial.start_time.getHMN().toFixed(3)) : null, end_time: serial.end_time ? String(serial.end_time.getHMN().toFixed(3)) : null, date: serial.date ? Number(serial.date.yyyymmdd()) : null, end_date: serial.end_date ? Number(serial.end_date.yyyymmdd()) : null, junctions: this.junctions ? Object.values(this.junctions).map(j => j.eject()) : [], attendees: this.attendees ? this.attendees.map((a) => a.eject()) : null, children: this.children ? reduced ? this.children.map(s => s.uuid) : this.children.map((s) => s.eject(localize)) : null, schedules: serial.schedules ? serial.schedules.map((s) => s.eject()) : null, type: _1.Type.Event });
            }
            catch (err) {
                console.log(err);
                console.log(serial);
                throw Error("Error occured while ejecting the event.");
            }
        };
        this.getSchedulesInFrame = (date = (0, dayjs_1.default)(), time = (0, dayjs_1.default)().toLocalChronos()) => {
            var _b;
            if (!this.schedules) {
                return [];
            }
            const frame = (_b = this.schedules) === null || _b === void 0 ? void 0 : _b.filter((x) => {
                if (!x.end_date) {
                    if (x.start_date && x.start_date.isBefore(date.add(1, 'd'), 'd')) {
                        return true;
                    }
                    return false;
                }
                if ((x.start_date && x.start_date.isBefore(date.add(1, 'd'), 'd')) && x.end_date.isAfter(date.add(-1, 'd'), 'd')) {
                    return true;
                }
                return false;
            });
            return frame;
        };
        this.getType = () => {
            return _1.Type.Event;
        };
        this.isOpen = (date = (0, dayjs_1.default)(), time = (0, dayjs_1.default)().toLocalChronos()) => {
            try {
                // Multi-date events
                if (this.date) {
                    if (date.yyyymmdd() >= this.date.yyyymmdd()) {
                        if (this.end_date) {
                            return date.yyyymmdd() <= this.end_date.yyyymmdd();
                        }
                        return true;
                    }
                    return false;
                }
                if (!this.schedules) {
                    return false;
                }
                // Yesturday may have overlap
                if (time.getAMP() === 'AM') {
                    const yesturFrame = this.getSchedulesInFrame(date.add(-1, 'day'), time.add(24, false));
                    if (yesturFrame && yesturFrame.length > 0 && yesturFrame[0].isOpen(date.add(-1, 'day').day(), time.add(24, false))) {
                        return true;
                    }
                }
                // Today
                const frame = this.getSchedulesInFrame(date, time);
                return frame[0].isOpen(date.day(), time);
            }
            catch (err) {
                return false;
            }
        };
        this.isOpenDetailed = (date = (0, dayjs_1.default)(), time) => {
            const template = {
                date,
                hours: null,
                schedule: null,
                isOpen: null,
                context: null,
                regular: null,
                lateNight: false,
                metadata: null
            };
            try {
                // Multi-date events
                if (this.date) {
                    if (date.yyyymmdd() >= this.date.yyyymmdd()) {
                        if (this.end_date) {
                            return Object.assign(Object.assign({}, template), { isOpen: date.yyyymmdd() <= this.end_date.yyyymmdd(), context: "Open", metadata: "Multi-Day Event, after start date, no end date." });
                        }
                        return Object.assign(Object.assign({}, template), { isOpen: true, context: "Open", metadata: "Multi-Day Event, within start and end date." });
                    }
                    return Object.assign(Object.assign({}, template), { isOpen: false, context: "Closed", metadata: "Date exists, not within start and end range." });
                }
                if (!this.schedules) {
                    return null;
                }
                if (time && time.getAMP() === 'AM') {
                    const yesturFrame = this.getSchedulesInFrame(date.add(-1, 'day'), time.add(24, false));
                    if (yesturFrame && yesturFrame.length > 0 && yesturFrame[0].isOpen(date.add(-1, 'day').day(), time.add(24, false))) {
                        const yesturContext = yesturFrame[0].isOpenWithContext(date.add(-1, 'day').day(), time.add(24, false));
                        return {
                            date,
                            hours: yesturFrame[0].getHours(date.day()),
                            schedule: yesturFrame[0],
                            isOpen: yesturContext.isOpen,
                            context: yesturContext.context,
                            regular: yesturFrame[0].isNotRegular() ? this.getRegularHours(date.add(-1, 'day')) : null,
                            lateNight: true,
                            metadata: "Scheduled. Case A."
                        };
                    }
                }
                const frame = this.getSchedulesInFrame(date, time);
                const isOpenWithContext = frame[0].isOpenWithContext(date.day(), time);
                return {
                    date,
                    hours: frame[0].getHours(date.day()),
                    schedule: frame[0],
                    isOpen: isOpenWithContext.isOpen,
                    context: isOpenWithContext.context,
                    regular: frame[0].isNotRegular() ? this.getRegularHours(date) : null,
                    lateNight: false,
                    metadata: "Scheduled. Case B."
                };
            }
            catch (_b) {
                return Object.assign(Object.assign({}, template), { isOpen: false, context: "Closed", regular: this.getRegularHours(), metadata: "Scheduled. Case C." });
            }
        };
        this.union = (other, date = (0, dayjs_1.default)()) => {
            if (!other) {
                console.log("No other");
                return this;
            }
            let result = new Event();
            // Decide on regular hours
            const ourRegularHours = this.getRegularHours(date);
            const theirRegularHours = other.getRegularHours(date);
            if (!ourRegularHours && !theirRegularHours) {
                // No regular hours to consider
                console.log({
                    this: JSON.stringify(this.schedules, null, 2),
                    other: JSON.stringify(other.schedules, null, 2)
                }, { depth: null });
            }
            else if (!ourRegularHours || !theirRegularHours) {
                result = !ourRegularHours ? other : this;
                // console.log({
                //   message: "One doesn't exist.",
                //   a: ourRegularHours ? ourRegularHours.to_string() : "dne",
                //   b: theirRegularHours ? theirRegularHours.to_string() : "dne",
                //   c: result ? result.getRegularHours()?.to_string() : "dne"
                // });
            }
            else {
                const unionRegularHours = ourRegularHours.union(theirRegularHours);
                // console.log({
                //   message: "After merge",
                //   a: ourRegularHours.to_string(),
                //   b: theirRegularHours.to_string(),
                //   c: unionRegularHours.to_string()
                // });
                unionRegularHours.as_text = unionRegularHours.to_string();
                result.pushSchedule(unionRegularHours);
            }
            result.name = `${this.name} and ${other.name}`;
            return result;
        };
        this.getHostColumnString = () => {
            return 'event_id';
        };
        this.getIconPath = (quick) => {
            if (!this.icon_img) {
                return null;
            }
            return this.icon_img.path;
        };
        this.type = _1.Type.Event;
        if (!event) {
            this.uuid = String((0, uuid_1.v4)());
            this.junctions = new Map();
            this.token = null;
            this.metadata = {};
            this.is_local = true;
            this.schedules = [];
            this.isVisible = false;
            this.version = 0;
            return this;
        }
        Object.assign(this, event);
        this.uuid = event.uuid || String((0, uuid_1.v4)());
        this.name = event.name || "";
        this.junctions = new Map();
        if (event.junctions) {
            for (const item of event.junctions) {
                const j = new junctions_1.Junction(item, _1.Type.Event);
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
        this.is_local = 'is_local' in event ? event.is_local ? true : false : is_local;
        if (event.date) {
            this.date = this.is_local ? (0, dayjs_1.default)(String(event.date)).tz('America/Chicago') : dayjs_1.default.utc(String(event.date));
            if (event.start_time) {
                const start_time = new chronos_1.Chronos(Number(event.start_time));
                this.date = this.date.set('hour', start_time.getHour()).set('minute', start_time.getMinute());
            }
        }
        if (this.end_date) {
            this.end_date = this.is_local ? (0, dayjs_1.default)(String(event.end_date)).tz('America/Chicago') : dayjs_1.default.utc(String(event.end_date));
        }
        this.start_time = this.start_time ? new chronos_1.Chronos(Number(event.start_time), false) : null;
        this.end_time = this.end_time ? new chronos_1.Chronos(Number(event.end_time), false) : null;
        this.schedules = event.schedules && event.schedules[0] != null ? event.schedules.map((x) => {
            return new schedules_1.Schedule(x, is_local);
        }) : [];
        this.schedules = this.schedules ? schedules_1.Schedule.rank(this.schedules) : null;
        // End Date fill in
        if (!this.start_time && (!event.schedules || event.schedules.length === 0)) {
            if (!this.end_date) {
                this.end_date = this.date;
            }
        }
        this.children = ((_b = event.children) === null || _b === void 0 ? void 0 : _b.map((e) => new Event(e, is_local))) || null;
        this.token = event.token || null;
        this.metadata = event.metadata || {};
        this.isVisible = false;
        this.collisions = 0;
        this.version = event.version || 0;
        return this;
    }
}
exports.Event = Event;
