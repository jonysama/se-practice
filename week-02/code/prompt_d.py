def analyze_marks(marks, pass_mark=50):
    if not marks:
        raise ValueError("marks must not be empty")

    for mark in marks:
        if isinstance(mark, bool) or not isinstance(mark, (int, float)):
            raise ValueError("all marks must be numeric")
        if not 0 <= mark <= 100:
            raise ValueError("all marks must be between 0 and 100")

    average = round(sum(marks) / len(marks), 2)
    highest = max(marks)
    lowest = min(marks)

    passing = sum(mark >= pass_mark for mark in marks)
    pass_rate = round((passing / len(marks)) * 100, 2)

    return {
        "average": average,
        "highest": highest,
        "lowest": lowest,
        "pass_rate": pass_rate,
    }


# Tests

# One mark
assert analyze_marks([75]) == {
    "average": 75.0,
    "highest": 75,
    "lowest": 75,
    "pass_rate": 100.0,
}

# Decimals
assert analyze_marks([40.5, 60.5, 80.0], 50) == {
    "average": 60.33,
    "highest": 80.0,
    "lowest": 40.5,
    "pass_rate": 66.67,
}

# Custom pass mark
assert analyze_marks([40, 60, 80], 70) == {
    "average": 60.0,
    "highest": 80,
    "lowest": 40,
    "pass_rate": 33.33,
}

# Empty list
try:
    analyze_marks([])
    assert False, "Expected ValueError"
except ValueError:
    pass

# Text value
try:
    analyze_marks([40, "60", 80])
    assert False, "Expected ValueError"
except ValueError:
    pass

# Value below 0
try:
    analyze_marks([-1, 50, 80])
    assert False, "Expected ValueError"
except ValueError:
    pass

# Value above 100
try:
    analyze_marks([50, 80, 101])
    assert False, "Expected ValueError"
except ValueError:
    pass

# Boolean rejection
try:
    analyze_marks([40, True, 80])
    assert False, "Expected ValueError"
except ValueError:
    pass

# Exact pass mark counts as passing
assert analyze_marks([50, 49], 50)["pass_rate"] == 50.0