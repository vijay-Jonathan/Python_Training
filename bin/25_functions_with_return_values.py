"""
From outside, Can we access variables defined inside the functions ??
In our case, can we access total_marks variable outside the function??
NO : Directly we can't access

But
we can send from function using 'return' statement

"""
print("No Direct Access")
print("-"*40)
#----------------------

def my_student_func(student_name, subject_1_marks, subject_2_marks):
    print("Student Name is : ",student_name)
    total_marks = subject_1_marks + subject_2_marks

my_student_func("Student-1",80,90)
#print("total_marks : ",total_marks) # ERROR, Directly we can't access 'total_marks'

print("-"*40)
#----------------------

print("Using return to send values outside")
print("-"*40)
#----------------------
def my_student_func(student_name, subject_1_marks, subject_2_marks):
    print("Student Name is : ",student_name)
    total_marks = subject_1_marks + subject_2_marks
    return total_marks


# 1st call
my_student_func("Student-1",80,90) # This will execute BUT NOT CAPTURED return value

# 2nd call
receved_value = my_student_func("Student-1",80,90)
print("Received from function : ",receved_value)

print("-"*40)
#----------------------

print("Return more than one value")
print("-"*40)
#----------------------
def my_student_func(student_name, subject_1_marks, subject_2_marks):
    print("Student Name is : ",student_name)
    total_marks = subject_1_marks + subject_2_marks
    return total_marks, subject_1_marks, subject_2_marks # It will go as tuple
    #return (total_marks, subject_1_marks, subject_2_marks)  # It will go as tuple
    #return [total_marks, subject_1_marks, subject_2_marks] # It will go as list
    # return {total_marks, subject_1_marks, subject_2_marks} # It will go as set
    # return {"total_marks" : total_marks, "subject_1_marks" : subject_1_marks, "subject_2_marks":subject_2_marks # It will go as dictionary
    # return (10+10-10)/2 # It will evaluate and return the result
    # return # No value means None will go

    # After the return statment, if there are any statements then it will never execute
    # Becuase : return will comeout of the function with value if any.
    # If no value mentions in return hen None value will go


# 1st call
my_student_func("Student-1",80,90) # This will execute BUT NOT CAPTURED return value

# 2nd call
receved_value = my_student_func("Student-1",80,90)
print("Received from function : ",receved_value)

print("-"*40)
#----------------------