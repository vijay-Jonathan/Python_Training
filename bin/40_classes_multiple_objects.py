"""
39th example is fine if we want to store 2-3 students data.
If we want to store 100's or more students data then do we really need to
create those many classes??

In those scenarios, not required to create those many classes,
Instead we can make use one more feature of class,
i.e : One class can produce multiple copies
(Instead of using the term copies, we will use the term "instance object")

"""

print("Trying to create more objects using single class ")
print("-"*40)
#--------------------------------

# What we want is, if we send student1 details it should give me one copy (Instance object)
# for student1
# similary for student2,3,4.........lakhs or more.. copies


class Student:
    def __init__(self,n,s1,s2):
        self.name = n
        self.sub1_marks = s1
        self.sub2_marks = s2

# Finally what we want is, inside Student1 object student1 details,
# inside Student2 object student2 details and so on

# how to obtain copy (Instance Object) for student 1
Student1 = Student("Student-1",70,80) # It will create and initialize object using __init__
# Internally : Student.__init__(Student1,"Student-1",70,80)
# self will be Student1
# student1.name = "Student-1"
# student1.sub1_marks = 70
# student1.sub2_marks = 80

#similarly
Student2 = Student("Student-2",80,90) # It will create the object and initialize with init,
# Internally : Student.__init__(Student2,"Student-2",80,90)

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


