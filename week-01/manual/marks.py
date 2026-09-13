import sys

if len(sys.argv) > 1:
    text = sys.argv[1]
else:
    text = "85, 23, 45, 90, 92"

marks = []
for item in text.split(","):
    item = item.strip()
    try:
        value = float(item)
        if 0 <= value <= 100:
            if value == int(value):
                marks.append(int(value))
            else:
                marks.append(value)
    except:
        pass

if len(marks) == 0:
    print("No valid marks found.")
else:
    total = 0
    for m in marks:
        total += m
    average = total / len(marks)

    highest = marks[0]
    lowest = marks[0]
    for m in marks:
        if m > highest:
            highest = m
        if m < lowest:
            lowest = m

    passing = 0
    for m in marks:
        if m >= 50:
            passing += 1
    pass_rate = passing / len(marks) * 100

    print("Valid marks:", len(marks))
    print("Average: %.2f" % average)
    print("Highest:", highest)
    print("Lowest:", lowest)
    print("Pass rate: %.1f%%" % pass_rate)