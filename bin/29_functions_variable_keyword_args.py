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
3) Function with variable KEYWORD only arguments
"""
# The below code is copied from 27th and modified

def my_student_func(*,student_name, subject_1_marks=35, subject_2_marks=35,**optional_sub_marks):
    print("Student Name is : ",student_name)
    print("optional_subjects : ",optional_sub_marks)
    total_marks = subject_1_marks + subject_2_marks + sum(optional_sub_marks.values())
    return total_marks

print("# 1st call")
receved_value = my_student_func(student_name="Student-1") # optional_sub_marks EMPTY
print("Received from function : ",receved_value)

print("#2nd call ")
receved_value = my_student_func(student_name="Student-1",subject_2_marks=35,subject_1_marks=35) # optional_sub_marks EMPTY
print("Received from function : ",receved_value)

print("#3rd call ")
receved_value = my_student_func(student_name="Student-1",subject_2_marks=70,subject_1_marks=80) # optional_sub_marks EMPTY
print("Received from function : ",receved_value)

print("#4th call ")
receved_value = my_student_func(student_name="Student-1",subject_2_marks=70,subject_1_marks=80, Elective_1=50, Elective_2=60)
# optional_sub_marks={"Elective_1":50, "Elective_2":60}
print("Received from function : ",receved_value)
