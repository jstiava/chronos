"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schedule = exports.ScheduleType = void 0;
const events_1 = require("./events");
const dayjs_1 = __importDefault(require("dayjs"));
const hours_1 = require("./hours");
const uuid_1 = require("uuid");
const _1 = require("./");
var ScheduleType;
(function (ScheduleType) {
    ScheduleType["Regular"] = "regular";
    ScheduleType["Special"] = "special";
    ScheduleType["Closure"] = "closure";
})(ScheduleType || (exports.ScheduleType = ScheduleType = {}));
class Schedule {
    id() {
        return this.uuid;
    }
    getHostColumnString() {
        return 'schedule_id';
    }
    getType() {
        return _1.Type.Schedule;
    }
    login() {
        return null;
    }
    getItem() {
        return this;
    }
    // Unlike other Member classes, schedule's connectTo affects the instance pointers
    connectTo(other) {
        if (other instanceof events_1.Event) {
            this.event_id = other.id();
            return null;
        }
        if (other instanceof Location) {
            this.location_id = other.id();
            return null;
        }
    }
    getIconPath() {
        return null;
    }
    getActiveDaysPerWeek() {
        let value = 0;
        this.days.forEach((day, index) => {
            if (day != 0) {
                value += 1;
            }
        });
        return value;
    }
    getHoursPerWeek() {
        let value = 0;
        this.days.forEach((day, index) => {
            const hour = this.getHours(index, new _1.Chronos(12));
            if (typeof hour === 'boolean') {
                value += hour ? 24 : 0;
            }
            else {
                value += hour.getNumberOfHours();
            }
        });
        return value;
    }
    isNotRegular() {
        return this.schedule_type ? this.schedule_type != 'regular' : false;
    }
    // TODO
    localize() {
        return this;
    }
    // TODO
    globalize() {
        return this;
    }
    getToken() {
        return null;
    }
    to_string() {
        let result = "";
        let pointer = 1;
        let active = this.days[0];
        let daysString = (0, hours_1.getDayString)(hours_1.DAYS.SUNDAY);
        while (pointer < 8) {
            if (active != this.days[pointer] || pointer === 7) {
                const endDayString = (0, hours_1.getDayString)(pointer - 1);
                if (daysString === "Sun" && pointer === 7) {
                    result += 'Daily';
                }
                else if (daysString != endDayString) {
                    result += `${daysString}-${endDayString}`;
                }
                else {
                    result += daysString;
                }
                if (active === 0) {
                    result += `: Closed\n`;
                }
                else if (active === 1) {
                    result += `: Open\n`;
                }
                else {
                    console.log({
                        result, pointer, active, daysString, endDayString
                    });
                    result += `: ${this.hours[active - hours_1.Hours.HOURS_LOCATOR_PREFIX].to_string()}\n`;
                }
                daysString = (0, hours_1.getDayString)(pointer);
                active = this.days[pointer];
            }
            pointer += 1;
        }
        return result;
    }
    copy(hoursAndDaysOnly = false) {
        return this.eject(hoursAndDaysOnly);
    }
    eject(hoursAndDaysOnly = false) {
        let serial = {};
        const _a = this, { is_local } = _a, data = __rest(_a, ["is_local"]);
        Object.keys(data).forEach(key => {
            if (typeof data[key] === 'function') {
                delete data[key];
            }
        });
        Object.assign(serial, data);
        if (!serial) {
            throw Error;
        }
        if (hoursAndDaysOnly) {
            return {
                days: [...serial.days],
                hours: this.hours ? [...this.hours.map((r) => {
                        return r.eject();
                    })] : null,
            };
        }
        return Object.assign(Object.assign({}, serial), { start_date: serial.start_date ? serial.start_date.yyyymmdd() : null, end_date: serial.end_date ? serial.end_date.yyyymmdd() : null, days: [...serial.days], hours: this.hours ? [...this.hours.map((r) => {
                    return r.eject();
                })] : null });
    }
    static rank(schedules) {
        const copy = schedules;
        copy.sort((a, b) => {
            try {
                if (!a.start_date || !b.start_date) {
                    return 0;
                }
                let a_start = a instanceof Schedule ? a.start_date.yyyymmdd() : b.start_date;
                let b_start = b instanceof Schedule ? b.start_date.yyyymmdd() : b.start_date;
                if (!a.end_date || !b.end_date) {
                    if (!b.end_date) {
                        return a_start > b_start ? -1 : 1;
                    }
                    return 1;
                }
                let a_end = a instanceof Schedule ? a.end_date.yyyymmdd() : b.end_date;
                let b_end = b instanceof Schedule ? b.end_date.yyyymmdd() : b.end_date;
                return (a_end - a_start) - (b_end - b_start);
            }
            catch (err) {
                return 0;
            }
        });
        return copy;
    }
    /**
     *
     * @param day
     * @returns
     */
    removeHoursOnDay(day) {
        const pointer = typeof day === "number" ? day : (0, hours_1.getDayIndex)(day);
        if (pointer == -1) {
            throw Error("Can't find date that matches");
        }
        const copy = this.days[pointer];
        this.days[pointer] = hours_1.Hours.CLOSED;
        if (copy < 2) {
            // Closed or open
            return;
        }
        let count = 0;
        for (const day of this.days) {
            if (day === copy) {
                count += 1;
            }
        }
        if (count === 0) {
            for (let i = 0; i < this.days.length; i++) {
                if (this.days[i] > copy) {
                    this.days[i] -= 1;
                }
            }
            this.hours.splice(copy - 2, 1);
        }
        return;
    }
    /**
     * e.g. Replace Tue's schedule with '8am-7pm' as Hours,
     * has residual effects
     * @param day
     * @param newHours
     * @returns
     */
    replaceHoursOnDayWith(day, newHours) {
        const pointer = typeof day === "number" ? day : (0, hours_1.getDayIndex)(day);
        if (pointer == -1) {
            throw Error("Can't find date that matches");
        }
        const hoursOfDayPointer = this.days[pointer];
        if (typeof newHours === "boolean") {
            if (hoursOfDayPointer === hours_1.Hours.OPEN || hoursOfDayPointer === hours_1.Hours.CLOSED) {
                this.days[pointer] = newHours ? hours_1.Hours.OPEN : hours_1.Hours.CLOSED;
                return;
            }
            if (hoursOfDayPointer > hours_1.Hours.OPEN) {
                const count = this.days.filter(d => d === hoursOfDayPointer).length;
                if (count <= 1) {
                    this.removeHoursOnDay(day);
                }
            }
            return;
        }
        if (hoursOfDayPointer > hours_1.Hours.OPEN) {
            const count = this.days.filter(d => d === hoursOfDayPointer).length;
            if (count <= 1) {
                this.removeHoursOnDay(day);
            }
        }
        const index = this.hours.push(newHours) - 1;
        this.days[pointer] = index + hours_1.Hours.HOURS_LOCATOR_PREFIX;
    }
    getHours(day = (0, dayjs_1.default)().day(), time = new _1.Chronos(12)) {
        const pointer = typeof day === "number" ? day : (0, hours_1.getDayIndex)(day);
        if (pointer == -1) {
            throw Error("Can't find date that matches");
        }
        // Evaluate prev date overlap
        if (time.getAMP() === 'AM') {
            const yesturdayPointer = pointer === 0 ? 6 : pointer - 1;
            const hoursOfYesturdayPointer = this.days[yesturdayPointer];
            if (hoursOfYesturdayPointer > 1) {
                const hoursOfYstrday = this.hours[hoursOfYesturdayPointer - hours_1.Hours.HOURS_LOCATOR_PREFIX];
                if (hoursOfYstrday.isOpen(time.add(24, false))) {
                    return hoursOfYstrday;
                }
            }
        }
        const hoursOfDayPointer = this.days[pointer];
        if (hoursOfDayPointer === hours_1.Hours.OPEN) {
            return true;
        }
        if (hoursOfDayPointer === hours_1.Hours.CLOSED) {
            return false;
        }
        const hoursOfDay = this.hours[hoursOfDayPointer - hours_1.Hours.HOURS_LOCATOR_PREFIX];
        return hoursOfDay;
    }
    // Lacks specificity
    getNextOccurance(day = (0, dayjs_1.default)()) {
        let count = 0;
        for (let pointer = day; count < 8; count++) {
            const hoursOfDayPointer = this.days[pointer.day()];
            if (hoursOfDayPointer === hours_1.Hours.OPEN) {
                return {
                    date: pointer,
                    start_time: null
                };
            }
            if (hoursOfDayPointer === hours_1.Hours.CLOSED) {
                continue;
            }
            const hoursOfDay = this.hours[hoursOfDayPointer - hours_1.Hours.HOURS_LOCATOR_PREFIX];
            return {
                date: pointer,
                start_time: hoursOfDay.getMin()
            };
        }
        return null;
    }
    isOpen(day = (0, dayjs_1.default)().day(), time = (0, dayjs_1.default)().toLocalChronos()) {
        let pointer = null;
        pointer = typeof day === 'string' ? (0, hours_1.getDayIndex)(day) : day;
        if (pointer == -1) {
            throw Error("Can't find date that matches");
        }
        // Evaluate prev date overlap
        if (time.getAMP() === 'AM') {
            const yesturdayPointer = pointer === 0 ? 6 : pointer - 1;
            const hoursOfYesturdayPointer = this.days[yesturdayPointer];
            if (hoursOfYesturdayPointer > 1) {
                const hoursOfYstrday = this.hours[hoursOfYesturdayPointer - hours_1.Hours.HOURS_LOCATOR_PREFIX];
                if (hoursOfYstrday.isOpen(time.add(24, false))) {
                    return true;
                }
            }
        }
        // Evaluate same date
        const hoursOfDayPointer = this.days[pointer];
        if (hoursOfDayPointer === hours_1.Hours.OPEN)
            return true;
        if (hoursOfDayPointer === hours_1.Hours.CLOSED)
            return false;
        const hoursOfDay = this.hours[hoursOfDayPointer - hours_1.Hours.HOURS_LOCATOR_PREFIX];
        return hoursOfDay.isOpen(time);
    }
    print(day) {
        let pointer = null;
        pointer = typeof day === 'string' ? (0, hours_1.getDayIndex)(day) : day;
        if (pointer == -1) {
            // throw Error("Can't find date that matches");
            return "No Hours / Closed";
        }
        const hoursOfDayPointer = this.days[pointer];
        if (hoursOfDayPointer === hours_1.Hours.OPEN) {
            return "Open 24/7";
        }
        if (hoursOfDayPointer === hours_1.Hours.CLOSED) {
            return "Closed";
        }
        const hoursOfDay = this.hours[hoursOfDayPointer - hours_1.Hours.HOURS_LOCATOR_PREFIX];
        return hoursOfDay.to_string();
    }
    isOpenWithContext(day = (0, dayjs_1.default)().day(), time) {
        let pointer = null;
        if (typeof day === "string") {
            pointer = (0, hours_1.getDayIndex)(day);
        }
        else {
            pointer = day;
        }
        if (pointer == -1) {
            return {
                isOpen: false,
                context: "No Hours"
            };
        }
        // Evaluate prev date overlap
        if (time && time.getAMP() === 'AM') {
            const yesturdayPointer = pointer === 0 ? 7 : pointer - 1;
            const hoursOfYesturdayPointer = this.days[yesturdayPointer];
            if (hoursOfYesturdayPointer > 1) {
                const hoursOfYstrday = this.hours[hoursOfYesturdayPointer - hours_1.Hours.HOURS_LOCATOR_PREFIX];
                if (hoursOfYstrday.isOpen(time.add(24, false))) {
                    return hoursOfYstrday.isOpenWithContext(time.add(24, false));
                }
            }
        }
        const hoursOfDayPointer = this.days[pointer];
        if (hoursOfDayPointer === hours_1.Hours.OPEN) {
            return {
                isOpen: true,
                context: "Open All Day"
            };
        }
        if (hoursOfDayPointer === hours_1.Hours.CLOSED) {
            return {
                isOpen: false,
                context: "Closed"
            };
        }
        try {
            const hoursOfDay = this.hours[hoursOfDayPointer - hours_1.Hours.HOURS_LOCATOR_PREFIX];
            return hoursOfDay.isOpenWithContext(time);
        }
        catch (err) {
            return {
                isOpen: false,
                context: "Closed."
            };
        }
    }
    constructor(data, is_local = false) {
        this.acquire = () => __awaiter(this, void 0, void 0, function* () {
            return false;
        });
        this.isOpenDaily = () => {
            for (const day of this.days) {
                if (day != 1) {
                    return false;
                }
            }
            return true;
        };
        /**
         * Write on this.days from pointer to goto.
         * @param pointer day index (0, 7)
         * @param goto day index (0, 7)
         * @param value 0 closed, 1 open, ...a position in the hours array - 2
         * @example (1, 2, 3) => this.days = [x, 3, 3, x, x, x, x]
         * @returns (1, 3, 3) => 2
         */
        this.writeAndMovePointer = (pointer, goto, value) => {
            this.days[pointer] = value;
            while (pointer !== goto) {
                pointer = (0, hours_1.incrementDay)(pointer);
                this.days[pointer] = value;
            }
            return pointer;
        };
        this.spreadHoursMappingIntoDays = (text, value) => {
            let pointer = hours_1.DAYS.SUNDAY;
            let writeMode = false;
            const daysScheduleRegex = new RegExp(hours_1.Hours.DAY_PATTERN, 'ig');
            const matches = [...text.matchAll(daysScheduleRegex)];
            for (const match of matches) {
                const isComma = match[hours_1.Hours.ISOLATED_COMMA_IN_PATTERN];
                const day = (0, hours_1.getDayIndex)(match[hours_1.Hours.ISOLATED_DAY_IN_PATTERN]);
                if (day === -1) {
                    console.log('Could not find date', match[hours_1.Hours.ISOLATED_DAY_IN_PATTERN]);
                    return;
                }
                if (day === 7) {
                    pointer = this.writeAndMovePointer(pointer, 6, value);
                    writeMode = true;
                    continue;
                }
                if (!writeMode) {
                    pointer = day;
                    writeMode = true;
                }
                if (isComma) {
                    pointer = this.writeAndMovePointer(pointer, day, value);
                    writeMode = false;
                    continue;
                }
                pointer = this.writeAndMovePointer(pointer, day, value);
            }
            return;
        };
        this.getStringForDay = (day) => {
            const theHours = this.getHours(day, new _1.Chronos(12));
            if (typeof theHours === "boolean") {
                return theHours ? "Open 24/7" : "Closed";
            }
            return theHours.as_text;
        };
        this.mask = (other) => {
            const hours = this.getHours(other.dow);
            const theMask = new hours_1.Hours(other.start_time.getHMN(), other.end_time.getHMN());
            if (typeof hours === 'boolean') {
                this.replaceHoursOnDayWith(other.dow, theMask);
                return;
            }
            this.replaceHoursOnDayWith(other.dow, theMask.union(hours));
            return;
        };
        this.unmask = (other) => {
            const hours = this.getHours(other.dow);
            const theMask = new hours_1.Hours(other.start_time.getHMN(), other.end_time.getHMN());
            if (typeof hours === 'boolean') {
                this.replaceHoursOnDayWith(other.dow, theMask);
                return;
            }
            this.replaceHoursOnDayWith(other.dow, hours.subtract(other));
            return;
        };
        this.add = (other, subtract = false) => {
            const copy = new Schedule(Object.assign(Object.assign({}, this.eject()), { uuid: String((0, uuid_1.v4)()), name: "Close Early" }));
            if (!other.start_time || !other.end_time || !other.date) {
                throw Error("Need start and end timing and at least one date.");
            }
            if (copy.schedule_type === ScheduleType.Closure) {
                return copy;
            }
            const hours = copy.getHours(other.date.day(), other.start_time);
            if (hours instanceof Array) {
                return copy;
            }
            if (typeof hours === 'boolean') {
                return copy;
            }
            const newHours = subtract ? hours.subtract(other) : hours.add(other);
            console.log({
                hours,
                other,
                newHours
            });
            if (!newHours) {
                throw Error("Could not create new hours.");
            }
            copy.replaceHoursOnDayWith(other.date.day(), newHours);
            copy.start_date = other.date;
            copy.end_date = other.date;
            copy.schedule_type = 'special';
            return copy;
        };
        this.subtract = (other) => {
            return this.add(other, true);
        };
        this.union = (other) => {
            if (other instanceof events_1.Event) {
                if (!other.date || !other.start_time || !other.end_time) {
                    throw Error("Usage. Need a date, start and end time.");
                }
                other = Schedule.createOffDrag(other.date, other.end_date, other.start_time, other.end_time);
            }
            const result = new Schedule();
            let hoursIndex = 2;
            let resultHours = null;
            for (const day of [0, 1, 2, 3, 4, 5, 6]) {
                const ours = this.days[day];
                const theirs = other.days[day];
                if (ours === hours_1.Hours.OPEN || theirs === hours_1.Hours.OPEN) {
                    result.days[day] = hours_1.Hours.OPEN;
                    continue;
                }
                if (ours === hours_1.Hours.CLOSED && theirs === hours_1.Hours.CLOSED) {
                    result.days[day] = hours_1.Hours.CLOSED;
                    continue;
                }
                if (!other.getHours(day)) {
                    resultHours = this.getHours(day);
                }
                else if (this.getHours(day)) {
                    resultHours = this.getHours(day).union(other.getHours(day));
                    if (!resultHours) {
                        console.log("Could not merge hours.");
                        continue;
                    }
                }
                if (!resultHours || typeof resultHours === "boolean") {
                    console.log("No result hours");
                    continue;
                }
                if (hoursIndex > 2 && resultHours.isEqual(result.hours[result.hours.length - 1])) {
                    result.days[day] = hoursIndex - 1;
                    console.log({
                        message: "Equal",
                        result: resultHours.to_string(),
                        lastHours: result.hours[result.hours.length - 1].to_string(),
                    });
                    continue;
                }
                console.log({
                    message: "Not equal",
                    result: resultHours.to_string(),
                    lastHours: hoursIndex > 2 ? result.hours[result.hours.length - 1].to_string() : "first placement",
                });
                result.hours.push(resultHours);
                result.days[day] = hoursIndex;
                hoursIndex += 1;
            }
            result.as_text = result.toString();
            result.start_date = result.start_date || (0, dayjs_1.default)();
            return result;
        };
        this.junctions = new Map();
        this.metadata = {};
        this.theme_color = null;
        this.type = _1.Type.Schedule;
        this.days = [0, 0, 0, 0, 0, 0, 0];
        if (arguments.length === 0) {
            this.uuid = String((0, uuid_1.v4)());
            this.as_text = 'placeholder';
            this.name = 'Regular Hours';
            this.schedule_type = "regular";
            this.start_date = null;
            this.end_date = null;
            this.hours = [];
            this.is_local = true;
            return;
        }
        if (!data) {
            throw Error("Need an arguments.");
        }
        if (data instanceof Schedule) {
            const theCopy = data.eject();
            return new Schedule(theCopy, true);
        }
        Object.assign(this, data);
        this.start_date = data.start_date ? (0, dayjs_1.default)(String(data.start_date)) : (0, dayjs_1.default)();
        this.end_date = data.end_date ? (0, dayjs_1.default)(String(data.end_date)) : null;
        this.hours = data.hours ? data.hours.map((hour) => {
            return new hours_1.Hours(hour.min, hour.max, hour.breaks, 0);
        }) : [];
        this.is_local = is_local;
    }
    ;
}
exports.Schedule = Schedule;
Schedule.createOffDrag = (startDate, endDate, startTime, endTime) => {
    const self = new Schedule();
    self.start_date = startDate;
    self.end_date = endDate;
    const start_date_index = startDate.get('day');
    const diff = endDate ? endDate.diff(startDate, 'day') : 7;
    let pointer = start_date_index;
    for (let counter = 0; counter <= diff; counter += 1) {
        self.days[pointer] = hours_1.Hours.HOURS_LOCATOR_PREFIX;
        pointer = (0, hours_1.incrementDay)(pointer);
    }
    try {
        const newHours = new hours_1.Hours(startTime.getHMN(), endTime.getHMN());
        self.hours.push(newHours);
        self.as_text = self.to_string();
    }
    catch (err) {
        console.log({
            message: "Error while creating",
            startTime,
            endTime,
            err
        });
    }
    return self;
};
Schedule.create = (name, type, rawString, startDate, endDate) => {
    const self = new Schedule();
    self.name = name;
    self.schedule_type = type;
    self.as_text = rawString;
    self.days = [0, 0, 0, 0, 0, 0, 0];
    self.hours = [];
    self.start_date = startDate;
    self.end_date = endDate || null;
    const combinedScheduleRegex = new RegExp(hours_1.Hours.COMBINED_SCHEDULE_SPLIT_PATTERN, 'gi');
    const matches = [...rawString.matchAll(combinedScheduleRegex)];
    if (self.schedule_type === ScheduleType.Closure) {
        return self;
    }
    if (!matches)
        throw Error('No matches found.');
    for (const match of matches) {
        if (!match.groups || !match.groups.times || !match.groups.days)
            continue;
        try {
            if (match.groups.times.includes('Open')) {
                self.spreadHoursMappingIntoDays(match.groups.days, hours_1.Hours.OPEN);
                continue;
            }
            if (match.groups.times.includes('Closed')) {
                self.spreadHoursMappingIntoDays(match.groups.days, hours_1.Hours.CLOSED);
                continue;
            }
            self.hours.push(new hours_1.Hours(match.groups.times));
            self.spreadHoursMappingIntoDays(match.groups.days, hours_1.Hours.HOURS_LOCATOR_PREFIX + self.hours.length - 1);
        }
        catch (err) {
            console.log(err);
        }
    }
    return self;
};
