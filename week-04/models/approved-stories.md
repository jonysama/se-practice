# Approved stories — Smart Campus study room booking

**Source of this set:** my week-03 stories, revised

## Scenario (from the Lesson 04 practice deck, slide 7)

Students view room availability, book a room, and cancel their own bookings. Administrators block
or unblock rooms and review usage.

- **R1** Future start, with duration greater than 0 and at most 2 hours.
- **R2** Active bookings for the same room cannot overlap.
- **R3** A blocked room cannot accept a new booking.
- **R4** A successful booking produces a confirmation.

## My approved stories

| ID | Story | Rules |
| --- | --- | --- |
| US-01 | As a Student, I want to view which study rooms are free at a given time, so that I can plan my study session without wasting time walking between rooms. | — |
| US-02 | As a Student, I want to book a free study room for a time slot, so that I have a guaranteed place to study at that time. | R1, R2, R3, R4 |
| US-03 | As a Student, I want to cancel a booking I made, so that the room becomes available to others when I no longer need it. | R2 |
| US-04 | As an Administrator, I want to block a room when it is unusable and unblock it when it is usable again, so that students are not shown rooms that cannot actually be used. | R3 |
| US-05 | As an Administrator, I want to review how study rooms are being used over a period, so that I can decide whether more rooms or different opening hours are needed. | — |
| US-06 | As a Student, I want to receive a confirmation when my booking is made or cancelled, so that I can rely on the booking without looking at the system again. | R4 |

**Out of scope** (do not model): payments, equipment in rooms, recurring bookings, waiting lists,
notifications other than the booking confirmation, user registration.