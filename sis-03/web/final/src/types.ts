export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  blocked: boolean;
}

export interface Booking {
  id: string;
  roomId: string;
  start: number; // minutes from 00:00, inclusive
  end: number; // minutes from 00:00, exclusive
  bookedBy: string;
}

export type AvailabilityResult =
  | { status: "available" }
  | { status: "unavailable"; reason: string };
