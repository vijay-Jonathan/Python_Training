"""
We are keeping only
-function definition
-class definition
-variables
so that we can re-use in other projects.

Since this file is created to keep only definition for reusing the code.
We are calling this file as "MODULES"

"""
college_name = "xyz college"

def my_student_func( subject_1_marks, subject_2_marks):
    total_marks = subject_1_marks + subject_2_marks
    return total_marks


if __name__ == "__main__":
    print("Value of __name__ : ",__name__)
    # Value of __name__ :  __main__ if we execute the current file
    # Value of __name__ :  MyModule if import executes
    # I am the owner of this module,
    # for my own testing purpose, writing below code,
    # the below code should not get imported to others
    print("Module Testing : Value in college_name is : ",college_name)
    print("Module Testing :  total marks is : ",my_student_func(50,50))
