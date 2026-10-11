def can_book(start, end, now, blocked, existing):
    # AC1: The interval must be valid and start strictly in the future.
    if not (0 <= start < end <= 1440 and start > now):
        return False

    # AC2: The booking duration must not exceed 120 minutes.
    if end - start > 120:
        return False

    # AC3: A blocked room cannot be booked.
    if blocked:
        return False

    # AC4: Reject any overlap with an existing booking.
    # Touching endpoints are allowed.
    for existing_start, existing_end in existing:
        if start < existing_end and end > existing_start:
            return False

    # AC5: All acceptance criteria are satisfied.
    return True