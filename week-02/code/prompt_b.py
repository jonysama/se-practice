def analyze_marks(marks, pass_mark=50):
    if not marks:
        raise ValueError("marks must not be empty")

    for mark in marks:
        if isinstance(mark, bool) or not isinstance(mark, (int, float)):
            raise ValueError("marks must contain only numeric values")
        if not 0 <= mark <= 100:
            raise ValueError("marks must be between 0 and 100")

    average = sum(marks) / len(marks)
    highest = max(marks)
    lowest = min(marks)
    pass_rate = sum(mark >= pass_mark for mark in marks) / len(marks) * 100

    return {
        "average": average,
        "highest": highest,
        "lowest": lowest,
        "pass_rate": pass_rate,
    }