# User stories — Smart Campus study room booking

---

### US-01
**Story:** As a Student, I want to view which study rooms are free at a given time, so that I can plan my study session without wasting time walking between rooms.
**Priority:** High
**Assumption:** Room availability is updated by the system when bookings are made or cancelled.

### US-02
**Story:** As a Student, I want to book a free study room for a time slot, so that I have a guaranteed place to study at that time.
**Priority:** High
**Assumption:** The system enforces the business rules R1–R4 (future start, max two hours, no overlap, blocked rooms cannot be booked).

### US-03
**Story:** As a Student, I want to cancel a booking I made, so that the room becomes available to others when I no longer need it.
**Priority:** Medium
**Assumption:** A student can cancel any of their own future bookings, but not past ones.

### US-04
**Story:** As an Administrator, I want to block a room when it is unusable and unblock it when it is usable again, so that students are not shown rooms that cannot actually be used.
**Priority:** High
**Assumption:** An Administrator can block or unblock any room at any time, and blocking prevents new bookings (R4).

### US-05
**Story:** As an Administrator, I want to review how study rooms are being used over a period, so that I can decide whether more rooms or different opening hours are needed.
**Priority:** Medium
**Assumption:** Reviewing usage is read-only and does not change any existing booking.

### US-06
**Story:** As a Student, I want to receive a confirmation when my booking is made or cancelled, so that I can rely on the booking without looking at the system again.
**Priority:** Medium
**Assumption:** The confirmation is sent by the system as a consequence of booking or cancelling, not by the student triggering it directly.

