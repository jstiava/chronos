
import '@testing-library/jest-dom';
import dayjs from '../src/dayjs';
import { Event, isMoment } from '../src/events';
import { Schedule } from '../src';


test('event types', async () => {
    const moment = new Event({
        name: "A moment of time.",
        date: 20250609,
        start_time: String(9)
    });

    const singleTimeEvent = new Event({
        name: "I'm an event with a date, start and end time.",
        date: 20250609,
        start_time: String(9),
        end_time: String(10)
    });

    const allSingleDayEvent = new Event({
        name: "I'm only on one day",
        date: 20250609,
        end_date: 20250609
    });

    const multiDayEvent = new Event({
        name: "I'm an event that goes on for multiple days.",
        date: 20250609,
        end_date: 20250615
    });

    const theSchedule = new Schedule().interpret("Mon-Thu: 9am-5pm, Fri: 8am-3pm, 6pm-10pm, 11pm-2am")
    const scheduled = new Event({
        name: "Service Hours",
        schedules: [theSchedule.eject()]
    });

    console.log(theSchedule);

})

test('unique identifier', async () => {

    const theEvent = new Event({
        name: "My test event",
        date: 20250609,
        start_time: String(9)
    });

    console.log({
        uuid: theEvent.uuid,
        id: theEvent.id()
    });

    expect(1).toBe(1)
})

test('copy', async () => {

    const theEvent = new Event({
        name: "My test event",
        date: 20250609,
        start_time: String(9)
    });

    const copiedEvent = theEvent.copy();
    if (isMoment(copiedEvent)) {
        copiedEvent.start_time = copiedEvent.start_time.add(2.333);
    }

    console.log({
        original: theEvent.start_time,
        copied: copiedEvent.start_time
    })

    expect(1).toBe(1)
});

test('localize', async () => {
    const theEvent = new Event({
        name: "My test event",
        date: 20250609,
        start_time: String(9)
    });
})