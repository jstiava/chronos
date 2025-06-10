
import '@testing-library/jest-dom';
import dayjs from '../src/dayjs';
import { Event } from '../src/events';
import { Chronos } from '../src';
import { truncate } from 'fs';


test('intro', async () => {

    const x = new Chronos(6);
    const y = new Chronos(9.333);

    console.log({
        x, y
    })

    expect(1).toBe(1)

})

test('manual setting', async () => {

    const x = new Chronos(6);
    x.setHour(7); 
    x.setMinute(30);

    console.log({
        x
    })

    expect(1).toBe(1)

})

test('increment/decrementing', async () => {

    const x = new Chronos(6);
    x.changeHour(2);
    x.changeMinute(15);

    console.log({x})

    expect(1).toBe(1)

});

test('addition', async () => {

    const x = new Chronos(6);
    const y = x.add(4);

    console.log({x, y});

    expect(1).toBe(1);

});


test('the HMN (Hour-Minute Number)', async () => {

    const x = new Chronos(6);
    const y = x.add(4.333);

    console.log({
        hmn: y.getHMN()
    });

    expect(1).toBe(1);

});

test('printing', async () => {

    const x = new Chronos(6);
    const y = x.add(4.333);

    console.log({
        simplePrint: y.print(true),
        print: y.print(),
        hourOnly: y.printHour(),
        minuteOnly: y.printMinute(),
        to: x.to(y)
    });

    expect(1).toBe(1);

});

test('compare', async () => {

    const x = new Chronos(6);
    const y = new Chronos(15);

    console.log({
        isEqual: x.isEqual(y),
        isAfter: x.isAfter(y),
        isBefore: x.isBefore(y),
        isWithin: x.isWithin(new Chronos(5), y),
        is: x.is(y)
    });

    expect(1).toBe(1);

});


test('late night hour', async () => {

    const x = new Chronos(-1);
    const y = new Chronos(25.5);
    const y_lateNight = new Chronos(25.5, false);

    console.log({
        x, y, y_lateNight
    })

    expect(1).toBe(1)

});