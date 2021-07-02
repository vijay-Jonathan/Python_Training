"""
For the below functions, most of the time, we are passing 35 as subject marks

Requirement is : are there any option to provide default value to function argument.
So that, we can take ADVANTAGE of avoid passing 35, if not we will pass the value

Answer is : YES
"""
def my_student_func(student_name, subject_1_marks=35, subject_2_marks=35): # Order of the argument- non default value arg then default value arg should come.
    print("Student Name is : ",student_name)
    total_marks = subject_1_marks + subject_2_marks
    return total_marks

print("# 1st call")
receved_value = my_student_func("Student-1") # idefault value will be used - subject_1_marks=35, subject_2_marks=35
print("Received from function : ",receved_value)

print("#2nd call ")
receved_value = my_student_func("Student-1",35,35) # This is also fine
print("Received from function : ",receved_value)

print("#3rd call ")
receved_value = my_student_func("Student-1",70,80)
print("Received from function : ",receved_value)

