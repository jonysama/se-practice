import { useMemo, useState } from "react";
import {
  Clock,
  Building2,
  Users,
  CheckCircle2,
  XCircle,
  CalendarClock,
  Lock,
  MapPin,
} from "lucide-react";
import type { AvailabilityResult } from "./types";
import { SAMPLE_ROOMS, SAMPLE_BOOKINGS } from "./sampleData";
import { checkAvailability, formatTime } from "./availability";

export default function App() {
  const [bookings] = useState(SAMPLE_BOOKINGS);
  const [roomId, setRoomId] = useState("");
  const [startStr, setStartStr] = useState("");
  const [endStr, setEndStr] = useState("");
  const [currentTime, setCurrentTime] = useState(600); // 10:00 by default
  const [result, setResult] = useState<AvailabilityResult | null>(null);

  const selectedRoom = useMemo(
    () => SAMPLE_ROOMS.find((r) => r.id === roomId),
    [roomId],
  );

  function parseToMinutes(timeStr: string): number {
    if (!timeStr) return NaN;
    const [h, m] = timeStr.split(":").map(Number);
    if (!Number.isFinite(h) || !Number.isFinite(m)) return NaN;
    return h * 60 + m;
  }

  function handleCheck(e: React.FormEvent) {
    e.preventDefault();
    const start = parseToMinutes(startStr);
    const end = parseToMinutes(endStr);
    const res = checkAvailability(selectedRoom, start, end, currentTime, bookings);
    setResult(res);
  }

  function handleReset() {
    setRoomId("");
    setStartStr("");
    setEndStr("");
    setResult(null);
  }

  const roomBookings = bookings.filter((b) => b.roomId === roomId);
  const currentTimeLabel = formatTime(currentTime);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-cyan-500/20 p-2 rounded-lg">
              <CalendarClock className="w-7 h-7 text-cyan-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Smart Campus Room Checker
            </h1>
          </div>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
            Check whether a campus room is available for a time slot before making a booking.
            Intervals are half-open: the start minute is included, the end minute is excluded.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Form Card */}
          <section className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-7">
            <h2 className="text-lg font-semibold mb-1">Check Availability</h2>
            <p className="text-sm text-slate-500 mb-5">
              Current campus time:{" "}
              <span className="font-mono font-semibold text-slate-700">
                {currentTimeLabel}
              </span>
            </p>

            <form onSubmit={handleCheck} className="space-y-5">
              {/* Room selection */}
              <div>
                <label
                  htmlFor="room"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Select Room
                </label>
                <select
                  id="room"
                  value={roomId}
                  onChange={(e) => {
                    setRoomId(e.target.value);
                    setResult(null);
                  }}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                >
                  <option value="">— Choose a room —</option>
                  {SAMPLE_ROOMS.map((room) => (
                    <option
                      key={room.id}
                      value={room.id}
                      disabled={room.blocked}
                    >
                      {room.name} ({room.building}){room.blocked ? " — Blocked" : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="start"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    Start Time
                  </label>
                  <input
                    id="start"
                    type="time"
                    value={startStr}
                    onChange={(e) => {
                      setStartStr(e.target.value);
                      setResult(null);
                    }}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                  />
                </div>
                <div>
                  <label
                    htmlFor="end"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    End Time
                  </label>
                  <input
                    id="end"
                    type="time"
                    value={endStr}
                    onChange={(e) => {
                      setEndStr(e.target.value);
                      setResult(null);
                    }}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                  />
                </div>
              </div>

              {/* Current time control */}
              <div>
                <label
                  htmlFor="currentTime"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Current Campus Time (for testing)
                </label>
                <input
                  id="currentTime"
                  type="time"
                  value={`${String(Math.floor(currentTime / 60)).padStart(2, "0")}:${String(currentTime % 60).padStart(2, "0")}`}
                  onChange={(e) => {
                    const v = parseToMinutes(e.target.value);
                    if (Number.isFinite(v)) setCurrentTime(v);
                    setResult(null);
                  }}
                  className="w-full sm:w-48 rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  className="flex-1 sm:flex-none bg-cyan-600 hover:bg-cyan-700 text-white font-medium text-sm px-6 py-2.5 rounded-lg transition shadow-sm"
                >
                  Check Availability
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm px-5 py-2.5 rounded-lg transition"
                >
                  Reset
                </button>
              </div>
            </form>

            {/* Result display */}
            {result && (
              <div
                className={`mt-6 rounded-xl border p-4 flex items-start gap-3 transition ${
                  result.status === "available"
                    ? "bg-emerald-50 border-emerald-200"
                    : "bg-rose-50 border-rose-200"
                }`}
              >
                {result.status === "available" ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p
                    className={`font-semibold text-base ${
                      result.status === "available"
                        ? "text-emerald-800"
                        : "text-rose-800"
                    }`}
                  >
                    {result.status === "available" ? "Available" : "Unavailable"}
                  </p>
                  {result.status === "unavailable" && (
                    <p className="text-sm text-rose-700 mt-0.5">{result.reason}</p>
                  )}
                  {result.status === "available" && (
                    <p className="text-sm text-emerald-700 mt-0.5">
                      This room is free for the selected interval.
                    </p>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* Room info & existing bookings */}
          <aside className="lg:col-span-2 space-y-5">
            {/* Selected room details */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                Room Details
              </h2>
              {selectedRoom ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-600" />
                    <span className="font-semibold text-slate-800">
                      {selectedRoom.name}
                    </span>
                    {selectedRoom.blocked && (
                      <span className="inline-flex items-center gap-1 text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-medium">
                        <Lock className="w-3 h-3" />
                        Blocked
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    {selectedRoom.building}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Users className="w-4 h-4 text-slate-400" />
                    Capacity: {selectedRoom.capacity}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-400">
                  Select a room to see its details.
                </p>
              )}
            </div>

            {/* Existing bookings for selected room */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                Existing Bookings
              </h2>
              {roomId && roomBookings.length > 0 ? (
                <ul className="space-y-2">
                  {roomBookings
                    .sort((a, b) => a.start - b.start)
                    .map((b) => (
                      <li
                        key={b.id}
                        className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2.5"
                      >
                        <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <div className="text-sm">
                          <span className="font-mono font-medium text-slate-700">
                            {formatTime(b.start)}–{formatTime(b.end)}
                          </span>
                          <span className="text-slate-500 ml-2">{b.bookedBy}</span>
                        </div>
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-400">
                  {roomId
                    ? "No existing bookings for this room."
                    : "Select a room to view its bookings."}
                </p>
              )}
            </div>
          </aside>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-slate-400 mt-8">
          Fictional sample data only — no real campus data is used.
        </p>
      </main>
    </div>
  );
}
