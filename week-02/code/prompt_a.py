students = {
    "Alice": [85, 92, 78, 90, 88],
    "Bob": [72, 65, 70, 68, 75],
    "Charlie": [95, 89, 93, 97, 91],
    "David": [55, 60, 58, 62, 57]
}

def get_grade(average):
    if average >= 90:
        return "A"
    elif average >= 80:
        return "B"
    elif average >= 70:
        return "C"
    elif average >= 60:
        return "D"
    else:
        return "F"

for name, marks in students.items():
    total = sum(marks)
    average = total / len(marks)
    grade = get_grade(average)
    status = "Pass" if average >= 40 else "Fail"

    print(f"{name}:")
    print(f"  Total: {total}")
    print(f"  Average: {average:.2f}")
    print(f"  Grade: {grade}")
    print(f"  Status: {status}")