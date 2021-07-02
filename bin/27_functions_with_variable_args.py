"""
Requirement is : we need to add argument to capture optional subjects/electives.
BUT
problem is, we don't know how many optionals subject student will be having it can be 0 or 1 or 2 etc..

SOLUTION : If we dont know, how many arguments are coming then we can use
VARIABLE ARGUMENTS

Function with variable arguments
"""
def my_student_func(student_name, subject_1_marks=35, subject_2_marks=35,*optional_sub_marks):
    print("Student Name is : ",student_name)
    print("optional_subjects : ",optional_sub_marks)
    total_marks = subject_1_marks + subject_2_marks + sum(optional_sub_marks)
    return total_marks

print("# 1st call")
receved_value = my_student_func("Student-1") # optional_sub_marks EMPTY
print("Received from function : ",receved_value)

print("#2nd call ")
receved_value = my_student_func("Student-1",35,35) # optional_sub_marks EMPTY
print("Received from function : ",receved_value)

print("#3rd call ")
receved_value = my_student_func("Student-1",70,80) # optional_sub_marks EMPTY
print("Received from function : ",receved_value)

print("#4th call ")
receved_value = my_student_func("Student-1",70,80,50,60) # optional_sub_marks=(50,60)
print("Received from function : ",receved_value)
