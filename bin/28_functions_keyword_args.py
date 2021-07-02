"""
We have
1) Function with positional argument
2) Function with positional argument with default values
3) Function with variable arguments

We wanted all 3 types mentioned above to accept dictionary kind of data, means key value pair
We got Solution for all 3 mentioned above
1) Function with Keyword only argument
2) Function with keyword only argument with default values
3) Function with variable KEYWORD only arguments

In this section,
1) Function with Keyword only argument
2) Function with keyword only argument with default values
"""
# Code is copied from 26th example and modified
def my_student_func(*, student_name, subject_1_marks=35, subject_2_marks=35):
    # CHANGES-1 = *. * will tell all the arguments after * are KEYWORD ONLY
    # ARGUMENT. IF YOU WANT TO PASS VALUES TO THIS ARGUMENT, YOU NEED TO
    # PASS "ARGUMENT_NAME=VALUE" format.
    print("Student Name is : ",student_name)
    total_marks = subject_1_marks + subject_2_marks
    return total_marks

print("# 1st call")
receved_value = my_student_func(student_name="Student-1") # idefault value will be used - subject_1_marks=35, subject_2_marks=35
print("Received from function : ",receved_value)

print("#2nd call ")
receved_value = my_student_func(student_name="Student-1",subject_1_marks=35,subject_2_marks=35) # This is also fine
print("Received from function : ",receved_value)

print("#3rd call ")
receved_value = my_student_func(student_name="Student-1",subject_1_marks=70,subject_2_marks=80)
print("Received from function : ",receved_value)

print("#4th call ")
D = {"student_name" : "Student-1" , "subject_1_marks" : 70, "subject_2_marks" : 80}
receved_value = my_student_func(**D) # **D will UNPACK, and pass each pair as argument
# Finally **D will prepare function call like this :
# my_student_func(student_name="Student-1",subject_1_marks=70,subject_2_marks=80)
print("Received from function : ",receved_value)
