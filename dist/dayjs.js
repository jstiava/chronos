import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import isToday from 'dayjs/plugin/isToday';
import timezone from 'dayjs/plugin/timezone';
import isBetween from 'dayjs/plugin/isBetween';
import utc from 'dayjs/plugin/utc';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import Chronos from './chronos';
dayjs.extend(isToday);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isoWeek);
dayjs.extend(isBetween);
dayjs.extend(advancedFormat);
dayjs.tz.setDefault('America/Chicago');
dayjs.prototype.flipMeridium = function () {
    const hour = this.hour();
    return hour >= 12 ? this.subtract(12, 'hour') : this.add(12, 'hour');
};
dayjs.prototype.max = function (second) {
    return this.isAfter(second, 'd') ? this : second;
};
dayjs.prototype.min = function (second) {
    return this.isBefore(second, 'd') ? this : second;
};
dayjs.prototype.setTime = function (time) {
    return this.set('hour', time.getHour()).set('minute', time.getMinute());
};
dayjs.prototype.getFrame = function (arg1 = 1) {
    const stageDays = [];
    for (let i = 0; i < arg1; i++) {
        stageDays.push(this.add(i, 'day'));
    }
    return stageDays;
};
dayjs.prototype.getDeixis = function (fallback, short = false) {
    const today = dayjs();
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
        return short ? this.format(fallback) : `Next ${this.format('dddd')}`;
    }
    if (!fallback) {
        return "";
    }
    return this.format(fallback);
};
dayjs.prototype.getTimezoneOffsetInHours = function () {
    return this.utcOffset() / 60;
};
dayjs.prototype.getTimezoneName = function () {
    return this.tz.guess();
};
dayjs.prototype.yyyymmdd = function () {
    return Number(this.format("YYYYMMDD"));
};
dayjs.prototype.asNumber = function () {
    return Number(this.format("YYYYMMDD"));
};
dayjs.prototype.toChronos = function () {
    const hour = this.hour();
    const minute = this.minute();
    return new Chronos(hour + minute / 60);
};
dayjs.prototype.toLocalChronos = function () {
    const hour = this.hour();
    const minute = this.minute();
    return new Chronos(hour + minute / 60);
};
dayjs.prototype.isYesterday = function () {
    const yesterday = dayjs().add(1, 'day');
    return this.isSame(yesterday, 'day');
};
dayjs.prototype.isTomorrow = function () {
    const tmmrw = dayjs().subtract(1, 'day');
    return this.isSame(tmmrw, 'day');
};
dayjs.prototype.isInDayView = function (threshold) {
    if (this.isToday()) {
        return dayjs().hour() >= threshold;
    }
    if (this.isTomorrow()) {
        return dayjs().hour() < threshold;
    }
    ;
    return false;
};
dayjs.prototype.to = function (other, includeYear = false, format = {
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
dayjs.prototype.duration = function (other, condesced = true) {
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
export default dayjs;
