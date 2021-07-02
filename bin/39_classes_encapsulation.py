"""
3 ways we can write programs
1) Without writing single function, we were able to write program
2) Scenario where we need to repeat the code, there we wrote functions
3) Some scenario, we need to write classes

In this section, we are discussing on point-3
3) Some scenario, we need to write classes

In what scenarios, writing class will be helpful
"""
print("Storing student data-Without using classes")
print("-"*40)
#------------------------------------

student_1_name = "Student-1"
student_1_sub1_marks = 70
student_1_sub2_marks = 80

student_2_name = "Student-2"
student_2_sub1_marks = 80
student_2_sub2_marks = 90

avg_sub1_marks = (student_1_sub1_marks + student_2_sub1_marks)/2
avg_sub2_marks = (student_1_sub2_marks + student_2_sub2_marks)/2

total_sub1_marks = student_1_sub1_marks + student_2_sub1_marks
total_sub2_marks = student_1_sub2_marks + student_2_sub2_marks

total_marks = student_1_sub1_marks + student_2_sub1_marks + student_1_sub2_marks + student_2_sub2_marks

print(" Student_1_name : ",student_1_name)
print(" Student_2_name : ",student_2_name)

print("avg_sub1_marks : ",avg_sub1_marks)
print("avg_sub2_marks : ",avg_sub2_marks)

print("total_sub1_marks : ",total_sub1_marks)
print("total_sub2_marks : ",total_sub2_marks)

print("total_marks : ",total_marks)

print("-"*40)
#------------------------------------

# If my college/classroom is having 100 students then
# We need to write name,sub1_marks,sub2_marks for all 100 people

# Can we use functions????
def my_func(n,m1,m2):
    student_1_name = n
    student_1_sub1_marks = m1
    student_1_sub2_marks = m2


my_func("Student-1",70,80)
my_func("Student-2",80,90)
# Now how to compute
# 1) avg_sub1_marks
# 2) avg_sub2_marks
# 3) total_sub1_marks
# 4) total_sub2_marks
# 5) total_marks

# First approach will work, without any issues

# Second -way, where we wrote function above will not work.
# Because, once the function executed, all data stored inside the
# Function will be erased. In our case, since we are computing
# avg_sub1_marks, avg_sub2_marks, total_sub1_marks, total_sub2_marks,
# and total_marks. We need all students data should be stored in some
# variables, so that throughout the program we can make use of it.

#------------------------------------

print("Storing student data-using classes")
print("-"*40)
#------------------------------------
# Finally, we need all students data avaiable throught the program


class Student1:
    name = "Student-1"
    sub1_marks = 70
    sub2_marks = 80


class Student2:
    name = "Student-2"
    sub1_marks = 80
    sub2_marks = 90


avg_sub1_marks = (Student1.sub1_marks + Student2.sub1_marks)/2
avg_sub2_marks = (Student1.sub2_marks + Student2.sub2_marks)/2

total_sub1_marks = Student1.sub1_marks + Student2.sub1_marks
total_sub2_marks = Student1.sub2_marks + Student2.sub2_marks

total_marks = Student1.sub1_marks + Student2.sub1_marks + Student1.sub2_marks + Student2.sub2_marks

print(" Student_1_name : ",Student1.name)
print(" Student_2_name : ",Student2.name)

print("avg_sub1_marks : ",avg_sub1_marks)
print("avg_sub2_marks : ",avg_sub2_marks)

print("total_sub1_marks : ",total_sub1_marks)
print("total_sub2_marks : ",total_sub2_marks)

print("total_marks : ",total_marks)

print("-"*40)
#------------------------------------

# Without writing classes also we were able to store in a varaible.
# Then what advantage we got using class?

# ADVANTAGE : Encapsulation :
#   - We were able to put each student data in seperate block.
#   - We got privacy for each student data
#------------------------------------

# Class names Student1 and Student2 are 2 objects
# So, Student1 and Student2 - called CLASS OBJECTS
# variable inside each class : name, sub1_marks, sub2_marks are called CLASS VARIABLE
# all Student1 class varaibles stored inside Student1 object
# similarly, all Student2 class varaibles stored inside Student2 object

#------------------------------------