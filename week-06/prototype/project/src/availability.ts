import type { Booking, Room, AvailabilityResult } from "./types";

const MAX_BOOKING_LENGTH = 120; // minutes
const MINUTE_OF_DAY_MAX = 1440; // 24:00

/**
 * Intervals are [start, end) — start is inclusive, end is exclusive.
 * Touching endpoints are allowed: [100,200) and [200,300) do not overlap.
 */
export function checkAvailability(
  room: Room | undefined,
  start: number,
  end: number,
  currentTime: number,
  bookings: Booking[],
): AvailabilityResult {
  // AC1: valid interval bounds and start must be after current time
  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    return { status: "unavailable", reason: "Please enter valid start and end times." };
  }
  if (start < 0 || end > MINUTE_OF_DAY_MAX || start >= end) {
    return { status: "unavailable", reason: "Interval must satisfy 0 ≤ start < end ≤ 1440." };
  }
  if (start <= currentTime) {
    return { status: "unavailable", reason: "Start time must be after the current time." };
  }

  // AC3: room blocked
  if (!room) {
    return { status: "unavailable", reason: "Please select a room." };
  }
  if (room.blocked) {
    return { status: "unavailable", reason: "Room is blocked." };
  }

  // AC2: booking longer than 120 minutes
  if (end - start > MAX_BOOKING_LENGTH) {
    return { status: "unavailable", reason: "Bookings cannot be longer than 120 minutes." };
  }

  // AC4: no overlap with existing bookings (touching endpoints allowed)
  const roomBookings = bookings.filter((b) => b.roomId === room.id);
  const overlap = roomBookings.find(
    (b) => start < b.end && b.start < end,
  );
  if (overlap) {
    return {
      status: "unavailable",
      reason: `Overlaps an existing booking (${formatTime(overlap.start)}–${formatTime(overlap.end)}).`,
    };
  }

  return { status: "available" };
}

export function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
