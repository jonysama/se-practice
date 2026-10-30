import type { Room, Booking } from "./types";

export const SAMPLE_ROOMS: Room[] = [
  { id: "r1", name: "Athena Hall", building: "Engineering Block", capacity: 120, blocked: false },
  { id: "r2", name: "Newton Lab", building: "Science Wing", capacity: 40, blocked: false },
  { id: "r3", name: "Da Vinci Studio", building: "Arts Center", capacity: 30, blocked: true },
  { id: "r4", name: "Curie Seminar Room", building: "Science Wing", capacity: 20, blocked: false },
  { id: "r5", name: "Tesla Auditorium", building: "Engineering Block", capacity: 200, blocked: false },
];

export const SAMPLE_BOOKINGS: Booking[] = [
  { id: "b1", roomId: "r1", start: 540, end: 600, bookedBy: "Intro to Algorithms" },
  { id: "b2", roomId: "r1", start: 720, end: 780, bookedBy: "Faculty Meeting" },
  { id: "b3", roomId: "r2", start: 600, end: 660, bookedBy: "Physics 101 Lab" },
  { id: "b4", roomId: "r4", start: 840, end: 900, bookedBy: "Research Group" },
  { id: "b5", roomId: "r5", start: 540, end: 660, bookedBy: "Guest Lecture" },
];
