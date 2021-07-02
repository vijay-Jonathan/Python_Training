"""
Functions without arguments
"""

print("Without using function")
print("-"*40)
#------------------------------
# Same code, more than 1 time then
student_name = "Student-1"
subject_1_marks = 80
subject_2_marks = 90
total_marks = subject_1_marks + subject_2_marks
print("total_marks : ",total_marks)

student_name = "Student-1"
subject_1_marks = 80
subject_2_marks = 90
total_marks = subject_1_marks + subject_2_marks
print("total_marks : ",total_marks)

student_name = "Student-1"
subject_1_marks = 80
subject_2_marks = 90
total_marks = subject_1_marks + subject_2_marks
print("total_marks : ",total_marks)

student_name = "Student-1"
subject_1_marks = 80
subject_2_marks = 90
total_marks = subject_1_marks + subject_2_marks
print("total_marks : ",total_marks)

print("-"*40)
#------------------------------

print("Using function")
print("-"*40)
#------------------------------

def my_student_func():
    student_name = "Student-1"
    subject_1_marks = 80
    subject_2_marks = 90
    total_marks = subject_1_marks + subject_2_marks
    print("total_marks : ", total_marks)

my_student_func()
my_student_func()

print("-"*40)
#------------------------------
