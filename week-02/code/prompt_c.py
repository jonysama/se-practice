def analyze_marks(marks, pass_mark=50):
    if not isinstance(marks, (list, tuple)):
        raise ValueError("marks must be a list or tuple")

    if not marks:
        raise ValueError("marks cannot be empty")

    if isinstance(pass_mark, bool) or not isinstance(pass_mark, (int, float)):
        raise ValueError("pass_mark must be numeric")

    for mark in marks:
        if isinstance(mark, bool) or not isinstance(mark, (int, float)):
            raise ValueError("all marks must be numeric")
        if mark < 0 or mark > 100:
            raise ValueError("marks must be between 0 and 100")

    average = sum(marks) / len(marks)
    highest = max(marks)
    lowest = min(marks)
    passed = sum(mark >= pass_mark for mark in marks)
    pass_rate = (passed / len(marks)) * 100

    return {
        "average": round(average, 2),
        "highest": highest,
        "lowest": lowest,
        "pass_rate": round(pass_rate, 2),
    }


# Tests
def test_analyze_marks():
    # One mark
    assert analyze_marks([75]) == {
        "average": 75,
        "highest": 75,
        "lowest": 75,
        "pass_rate": 100.0,
    }

    # Decimals
    assert analyze_marks([25.5, 50.5, 74.0]) == {
        "average": 50.0,
        "highest": 74.0,
        "lowest": 25.5,
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
        assert False
    except ValueError:
        pass

    # Text value
    try:
        analyze_marks([40, "60", 80])
        assert False
    except ValueError:
        pass

    # Below 0
    try:
        analyze_marks([-1, 50, 80])
        assert False
    except ValueError:
        pass

    # Above 100
    try:
        analyze_marks([40, 101, 80])
        assert False
    except ValueError:
        pass


if __name__ == "__main__":
    test_analyze_marks()
    print(analyze_marks([40, 60, 80], 50))