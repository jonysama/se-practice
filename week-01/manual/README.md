# Manual solution — Week 01

A small Python program that reads a list of student marks and prints the
number of valid marks, average, highest, lowest, and pass rate.

## How to run

    python marks.py "85, 23, 45, 90, 92"

Pass the marks as one argument, separated by commas.
If no argument is given, a default test set is used.

## Rules

- A valid mark is a number from 0 to 100 inclusive.
- Anything else (text, empty, -5, 101) is ignored — the program does not crash.
- A mark passes if it is >= 50.
- If there are no valid marks, the program prints a clear message.