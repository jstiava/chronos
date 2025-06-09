"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const isoWeek_1 = __importDefault(require("dayjs/plugin/isoWeek"));
const isToday_1 = __importDefault(require("dayjs/plugin/isToday"));
const timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
const isBetween_1 = __importDefault(require("dayjs/plugin/isBetween"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const advancedFormat_1 = __importDefault(require("dayjs/plugin/advancedFormat"));
const chronos_1 = require("./chronos");
const dayjs_1 = __importDefault(require("dayjs"));
require("dayjs/plugin/isoWeek");
require("dayjs/plugin/isToday");
require("dayjs/plugin/timezone");
require("dayjs/plugin/isBetween");
require("dayjs/plugin/utc");
require("dayjs/plugin/advancedFormat");
dayjs_1.default.extend(isToday_1.default);
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(timezone_1.default);
dayjs_1.default.extend(isoWeek_1.default);
dayjs_1.default.extend(isBetween_1.default);
dayjs_1.default.extend(advancedFormat_1.default);
dayjs_1.default.tz.setDefault('America/Chicago');
const belongDayjsPlugin = (_option, dayjsClass, factory) => {
    factory.extend(isToday_1.default);
    factory.extend(utc_1.default);
    factory.extend(timezone_1.default);
    factory.extend(isoWeek_1.default);
    factory.extend(isBetween_1.default);
    factory.extend(advancedFormat_1.default);
    factory.tz.setDefault('America/Chicago');
    dayjsClass.prototype.flipMeridium = function () {
        const hour = this.hour();
        return hour >= 12 ? this.subtract(12, 'hour') : this.add(12, 'hour');
    };
    dayjsClass.prototype.max = function (second) {
        return this.isAfter(second, 'd') ? this : second;
    };
    dayjsClass.prototype.min = function (second) {
        return this.isBefore(second, 'd') ? this : second;
    };
    dayjsClass.prototype.setTime = function (time) {
        return this.set('hour', time.getHour()).set('minute', time.getMinute());
    };
    dayjsClass.prototype.getFrame = function (arg1 = 1) {
        const stageDays = [];
        for (let i = 0; i < arg1; i++) {
            stageDays.push(this.add(i, 'day'));
        }
        return stageDays;
    };
    dayjsClass.prototype.getDeixis = function (fallback, short = false) {
        const today = (0, dayjs_1.default)();
        if (this.isBefore(today, 'day')) {
            return `${!short ? `Past ` : ''}${fallback ? this.format(fallback) : ""}`;
        }
        if (today.isSame(this, 'day')) {
            return `Today`;
        }
        if (this.isSame(today.add(1, 'day'), 'day')) {
            return short ? `Tmrw` : `Tomorrow`;
        }
        if (this.isSame(today.add(2, 'day'), 'day')) {
            return short ? this.format("ddd") : `Day After Tomorrow`;
        }
        if (this.isSame(today, 'week')) {
            return short ? this.format("ddd") : `This ${this.format('dddd')}`;
        }
        if (this.isSame(today.add(1, 'week'), 'week')) {
            return short && fallback ? this.format(fallback) : `Next ${this.format('dddd')}`;
        }
        if (!fallback) {
            return "";
        }
        return this.format(fallback);
    };
    dayjsClass.prototype.getTimezoneOffsetInHours = function () {
        return this.utcOffset() / 60;
    };
    dayjsClass.prototype.getTimezoneName = function () {
        return factory.tz.guess();
    };
    dayjsClass.prototype.yyyymmdd = function () {
        return Number(this.format("YYYYMMDD"));
    };
    dayjsClass.prototype.asNumber = function () {
        return Number(this.format("YYYYMMDD"));
    };
    dayjsClass.prototype.toChronos = function () {
        const hour = this.hour();
        const minute = this.minute();
        return new chronos_1.Chronos(hour + minute / 60);
    };
    dayjsClass.prototype.toLocalChronos = function () {
        const hour = this.hour();
        const minute = this.minute();
        return new chronos_1.Chronos(hour + minute / 60);
    };
    dayjsClass.prototype.isYesterday = function () {
        const yesterday = (0, dayjs_1.default)().add(1, 'day');
        return this.isSame(yesterday, 'day');
    };
    dayjsClass.prototype.isTomorrow = function () {
        const tmmrw = (0, dayjs_1.default)().subtract(1, 'day');
        return this.isSame(tmmrw, 'day');
    };
    dayjsClass.prototype.isInDayView = function (threshold) {
        if (this.isToday()) {
            return (0, dayjs_1.default)().hour() >= threshold;
        }
        if (this.isTomorrow()) {
            return (0, dayjs_1.default)().hour() < threshold;
        }
        ;
        return false;
    };
    dayjsClass.prototype.to = function (other, includeYear = false, format = {
        month: "",
        day: "",
        year: ""
    }) {
        const month = format.month || "MMM";
        const day = format.day || "D";
        const year = format.year || "YYYY";
        if (!other || this.isSame(other, 'day')) {
            return this.format(includeYear ? `${month} ${day}, ${year}` : `${month} ${day}`);
        }
        if (this.isSame(other, 'month')) {
            return `${this.format(month)} ${this.format(day)}—${other.format("D")}${includeYear ? this.format(", YYYY") : ""}`;
        }
        if (this.isSame(other, 'year')) {
            return `${this.format(`${month} ${day}`)}—${other.format(includeYear ? `${month} ${day}, ${year}` : `${month} ${day}`)}`;
        }
        return `${this.format(`${month} ${day}, ${year}`)}—${other.format(`${month} ${day}, ${year}`)}`;
    };
    dayjsClass.prototype.duration = function (other, condesced = true) {
        let granulariy = 0;
        let frame = this;
        const years = frame.diff(other, 'y');
        let result = "";
        if (years > 0) {
            result = `${years} ${condesced ? 'y' : years === 1 ? 'year' : 'years'}`;
            frame = frame.subtract(years, 'y');
            granulariy += 1;
        }
        const months = frame.diff(other, 'M');
        if (months > 0) {
            result = `${result ? `${result}, ` : ''}${months} ${condesced ? 'm' : months === 1 ? 'month' : 'months'}`;
            frame = frame.subtract(months, 'M');
            granulariy += 1;
        }
        const days = frame.diff(other, 'd');
        if (granulariy < 2 && days > 0) {
            result = `${result ? `${result}, ` : ''}${days} ${condesced ? 'd' : days === 1 ? 'day' : 'days'}`;
            frame = frame.subtract(days, 'd');
            granulariy += 1;
        }
        const hours = frame.diff(other, 'h');
        if (granulariy < 2 && hours > 0) {
            result = `${result ? `${result}, ` : ''}${hours} ${condesced ? 'h' : hours === 1 ? 'hour' : 'hours'}`;
            frame = frame.subtract(hours, 'h');
            granulariy += 1;
        }
        const minutes = frame.diff(other, 'm');
        if (granulariy < 1 && minutes > 0) {
            result = `${result ? `${result}, ` : ''}${minutes} ${condesced ? 'm' : minutes === 1 ? 'minute' : 'minutes'}`;
            frame = frame.subtract(minutes, 'm');
            granulariy += 1;
        }
        if (granulariy === 0 && result.length > 0) {
            return condesced ? 's' : "Seconds";
        }
        return result;
    };
};
dayjs_1.default.extend(belongDayjsPlugin);
exports.default = dayjs_1.default;
