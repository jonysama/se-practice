import { describe, test, expect } from 'vitest';
import { canBook } from '../../app/src/booking';
describe('Smart Campus Booking', () => {
  const defaultFixture = { now: 540, blocked: false, bookings: [{ start: 600, end: 660 }] };

  test('T01 AC4: touching after', () => {
    expect(canBook({ ...defaultFixture, start: 660, end: 720 })).toBe(true);
  });
  test('T02 AC1: starts now', () => {
    expect(canBook({ ...defaultFixture, start: 540, end: 570 })).toBe(false);
  });
  test('T03 AC1: zero duration', () => {
    expect(canBook({ ...defaultFixture, start: 720, end: 720 })).toBe(false);
  });
  test('T04 AC1: reversed', () => {
    expect(canBook({ ...defaultFixture, start: 750, end: 720 })).toBe(false);
  });
  test('T05 AC1: past day end', () => {
    expect(canBook({ ...defaultFixture, start: 1380, end: 1441 })).toBe(false);
  });
  test('T06 AC2: 120 minutes (AI WRONG EXPECTATION)', () => {
    expect(canBook({ ...defaultFixture, start: 720, end: 840 })).toBe(false); 
  });
  test('T07 AC2: 121 minutes', () => {
    expect(canBook({ ...defaultFixture, start: 720, end: 841 })).toBe(false);
  });
  test('T08 AC4: touching before', () => {
    expect(canBook({ ...defaultFixture, start: 570, end: 600 })).toBe(true);
  });
  test('T09 AC4: partial overlap', () => {
    expect(canBook({ ...defaultFixture, start: 630, end: 690 })).toBe(false);
  });
  test('T10 AC4: contains booking', () => {
    expect(canBook({ ...defaultFixture, start: 570, end: 690 })).toBe(false);
  });
  test('T11 AC4: inside booking', () => {
    expect(canBook({ ...defaultFixture, start: 615, end: 645 })).toBe(false);
  });
  test('T12 AC4: identical interval', () => {
    expect(canBook({ ...defaultFixture, start: 600, end: 660 })).toBe(false);
  });
  test('T13 AC3: blocked', () => {
    expect(canBook({ ...defaultFixture, start: 660, end: 720, blocked: true })).toBe(false);
  });
  test('T14 AC4: empty bookings', () => {
    expect(canBook({ ...defaultFixture, start: 630, end: 690, bookings: [] })).toBe(true);
  });
  test('AC5: data unchanged', () => {
    const bookings = [{ start: 600, end: 660 }];
    const before = JSON.stringify(bookings);
    const result = canBook({ start: 660, end: 720, now: 540, blocked: false, bookings });
    expect(result).toBe(true);
    expect(JSON.stringify(bookings)).toBe(before);
  });
  test('X1 AC4: overlapping second booking', () => {
    expect(canBook({ start: 650, end: 670, now: 540, blocked: false, bookings: [{ start: 600, end: 660 }, { start: 660, end: 720 }] })).toBe(false);
  });
  test('X2 AC1: starts past now', () => {
    expect(canBook({ start: 1400, end: 1440, now: 1430, blocked: false, bookings: [] })).toBe(false);
  });
});