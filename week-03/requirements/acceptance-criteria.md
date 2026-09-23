# Acceptance criteria — three selected stories

Assumptions first, then the criteria. Each block names the story it belongs to. 3 to 5 criteria per
story, every one in Given / When / Then form, and every set covers a validation or error case.

---

## Assumptions

- **Overlap (R3):** a booking that ends exactly when another begins **is** treated as an overlap and is **not allowed**. Reason: it is safer for scheduling and the implementation check `start < other_end and end > other_start` covers this without a special case.
- **Duration (R2):** a booking of exactly two hours **is allowed**. Reason: R2 says "at most two hours", and "at most" includes the limit itself.
- **Blocking (R4):** blocking a room prevents new bookings but does not cancel bookings that already exist at the time of blocking.

---

## US-02 — Book a free study room

### AC-01
- **Given** a Student has selected an available, unblocked room
- **When** the Student enters a start time in the future and a duration of at most two hours and confirms the booking
- **Then** the system creates the booking for that room and time slot.

### AC-02
- **Given** a Student is booking a room
- **When** the selected start time is in the past or is the current time
- **Then** the system rejects the booking and indicates that the booking must start in the future.

### AC-03
- **Given** a Student has selected an available room
- **When** the requested duration is greater than two hours
- **Then** the system rejects the booking and indicates that a booking may last at most two hours.
- **Boundary:** a duration of exactly two hours is accepted (see assumptions).

### AC-04
- **Given** a room already has a booking whose time range overlaps the requested range, including the case where one booking ends exactly when another begins
- **When** the Student attempts to book that room
- **Then** the system rejects the booking and indicates that the room is unavailable for the selected time.

### AC-05
- **Given** the selected room is blocked
- **When** the Student attempts to book it
- **Then** the system rejects the booking and does not create a new booking.

---

## US-03 — Cancel a booking

### AC-06
- **Given** a Student has a future booking that they made
- **When** the Student chooses to cancel the booking
- **Then** the system cancels the booking and marks it as cancelled.

### AC-07
- **Given** a Student has a booking whose scheduled time has already passed
- **When** the Student attempts to cancel it
- **Then** the system rejects the cancellation and leaves the booking unchanged.

### AC-08
- **Given** a booking was made by a different Student
- **When** the current Student attempts to cancel that booking
- **Then** the system rejects the cancellation and does not change the booking.

### AC-09
- **Given** a Student has just cancelled a future booking
- **When** another Student later tries to book that same room and time slot
- **Then** the slot is available and the new booking can be created, subject to R1–R4.

---

## US-04 — Block or unblock a room

### AC-10
- **Given** an Administrator selects an unblocked room
- **When** the Administrator blocks the room
- **Then** the room is marked as blocked and cannot be booked by Students.

### AC-11
- **Given** a room has existing bookings and is then blocked by an Administrator
- **When** the blocking action completes
- **Then** the existing bookings remain unchanged and only new bookings for that room are prevented.

### AC-12
- **Given** a room is currently blocked
- **When** an Administrator unblocks the room
- **Then** the room is marked as unblocked and can be booked again.

### AC-13
- **Given** a room has just been unblocked
- **When** a Student attempts to book it
- **Then** the booking is evaluated under R1–R3, and is rejected only if it violates one of those rules.