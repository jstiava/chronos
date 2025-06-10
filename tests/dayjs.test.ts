import '@testing-library/jest-dom';
import dayjs from '../src/dayjs';


test('intro', async () => {
    const x = dayjs();
    console.log({
        x
    })
    expect(1).toBe(1)
})

test('manipulate', async () => {
    const x = dayjs();
    const y = x.add(7, 'hour').add(324, 'minute');

    console.log({x : x.format(), y: y.format()})
})

test('to Chronos', async () => {
    const x = dayjs();
    const time = x.toChronos();
    console.log({
        x, time
    })
    expect(1).toBe(1)
});

test('print', async () => {

    const x = dayjs();
    const y = dayjs().add(4, 'months').add(15, 'd');

    console.log({
        x: x.format("dddd, MMMM DD, YYYY"),
        y: y.format("dddd, MMMM DD, YYYY"),
        to: x.to(y),
        duration: y.duration(x)
    })
});


test('injesting a utc date', async () => {

    const zulu = dayjs().utc();
    const local = dayjs()
    
    console.log({
        x: zulu.format(),
        y: local.format()
    });
});