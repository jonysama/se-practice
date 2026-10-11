import unittest
from booking import can_book


class BookingTests(unittest.TestCase):

    # --- Six table cases ---

    def test_touching_end_is_allowed(self):
        self.assertIs(can_book(660, 720, 540, False, [(600, 660)]), True)

    def test_partial_overlap_is_rejected(self):
        self.assertIs(can_book(630, 690, 540, False, [(600, 660)]), False)

    def test_blocked_room_is_rejected(self):
        self.assertIs(can_book(660, 720, 540, True, [(600, 660)]), False)

    def test_exactly_two_hours_is_allowed(self):
        self.assertIs(can_book(720, 840, 540, False, [(600, 660)]), True)

    def test_over_two_hours_is_rejected(self):
        self.assertIs(can_book(720, 841, 540, False, [(600, 660)]), False)

    def test_starting_now_is_rejected(self):
        self.assertIs(can_book(540, 570, 540, False, [(600, 660)]), False)

    # --- Further kinds ---

    def test_zero_length_interval_is_rejected(self):
        self.assertIs(can_book(700, 700, 540, False, [(600, 660)]), False)

    def test_reversed_interval_is_rejected(self):
        self.assertIs(can_book(700, 690, 540, False, [(600, 660)]), False)

    def test_end_at_1440_is_allowed(self):
        self.assertIs(can_book(1380, 1440, 1379, False, [(600, 660)]), True)

    def test_end_after_1440_is_rejected(self):
        self.assertIs(can_book(1380, 1441, 1379, False, [(600, 660)]), False)

    def test_empty_existing_allows_booking(self):
        self.assertIs(can_book(600, 660, 540, False, []), True)

    def test_overlap_with_second_of_multiple_bookings(self):
        self.assertIs(can_book(720, 780, 540, False, [(600, 660), (700, 760)]), False)

    def test_request_inside_existing_is_rejected(self):
        self.assertIs(can_book(615, 645, 540, False, [(600, 660)]), False)

    def test_existing_inside_request_is_rejected(self):
        self.assertIs(can_book(570, 690, 540, False, [(600, 660)]), False)

    def test_exact_duplicate_booking_is_rejected(self):
        self.assertIs(can_book(600, 660, 540, False, [(600, 660)]), False)

    # --- AC5: result must be exactly True or exactly False ---

    def test_result_is_bool_on_accept(self):
        self.assertIs(can_book(660, 720, 540, False, [(600, 660)]), True)

    def test_result_is_bool_on_reject_overlap(self):
        self.assertIs(can_book(630, 690, 540, False, [(600, 660)]), False)

    def test_result_is_bool_on_reject_blocked(self):
        self.assertIs(can_book(660, 720, 540, True, [(600, 660)]), False)

    def test_result_is_bool_on_reject_duration(self):
        self.assertIs(can_book(720, 841, 540, False, [(600, 660)]), False)

    def test_result_is_bool_on_reject_start_not_future(self):
        self.assertIs(can_book(540, 570, 540, False, [(600, 660)]), False)

    def test_result_is_bool_on_reject_zero_length(self):
        self.assertIs(can_book(700, 700, 540, False, [(600, 660)]), False)

    # --- AC5: existing must not be modified, every path ---

    def test_existing_not_modified_on_accept_sorted(self):
        existing = [(600, 660), (700, 760)]
        snapshot = list(existing)
        can_book(660, 720, 540, False, existing)
        self.assertEqual(existing, snapshot)

    def test_existing_not_modified_on_reject_sorted(self):
        existing = [(600, 660), (700, 760)]
        snapshot = list(existing)
        can_book(630, 690, 540, False, existing)
        self.assertEqual(existing, snapshot)

    def test_existing_not_modified_on_accept_unsorted(self):
        existing = [(700, 760), (600, 660)]
        snapshot = list(existing)
        can_book(660, 720, 540, False, existing)
        self.assertEqual(existing, snapshot)

    def test_existing_not_modified_on_reject_unsorted(self):
        existing = [(700, 760), (600, 660)]
        snapshot = list(existing)
        can_book(630, 690, 540, False, existing)
        self.assertEqual(existing, snapshot)

    def test_existing_not_modified_three_bookings(self):
        existing = [(700, 760), (600, 660), (900, 960)]
        snapshot = list(existing)
        can_book(660, 720, 540, False, existing)
        self.assertEqual(existing, snapshot)

    def test_existing_not_modified_when_blocked(self):
        existing = [(700, 760), (600, 660)]
        snapshot = list(existing)
        can_book(660, 720, 540, True, existing)
        self.assertEqual(existing, snapshot)

    def test_empty_existing_not_modified(self):
        existing = []
        snapshot = list(existing)
        can_book(600, 660, 540, False, existing)
        self.assertEqual(existing, snapshot)

    def test_existing_with_duplicates_not_modified(self):
        existing = [(600, 660), (600, 660)]
        snapshot = list(existing)
        can_book(660, 720, 540, False, existing)
        self.assertEqual(existing, snapshot)


if __name__ == "__main__":
    unittest.main()