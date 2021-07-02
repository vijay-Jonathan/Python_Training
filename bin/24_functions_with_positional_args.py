"""
Functions with positional arguments,

In example 23, inside the function, student_name and marks are hardcoded.
If we get option to dynamically pass student_name & marks,
Then we can reuse same function for other students also ?

They gave us SOULTION : We can write function with arguments called
'Functions with positional arguments.'
"""

def my_student_func(student_name, subject_1_marks, subject_2_marks):
    print("Student Name is : ",student_name)
    total_marks = subject_1_marks + subject_2_marks
    print("total_marks : ", total_marks)

my_student_func("Student-1",80,90)
my_student_func("Student-1",80,90)
my_student_func("Student-2",70,90)
my_student_func("Student-3",80,80)
