"""
in example 42nd, we added college as class variable,
Now we need to dynamically add variable "college_rank" inside the class object.
 - We know, college_rank is not required to store in each instance object
Now,
 We need to add methods to add college_rank to class object.
 So, inside methods we need a access to class object. (not self, which instance object).

"""

class Student:
    college = "Xyz College"
    def __init__(self,n,s1,s2):
        self.name = n
        self.sub1_marks = s1
        self.sub2_marks = s2

    @classmethod # decorator, Will force below method to take class object as first parameter instead of self
    def add_college_rank(cls,r):
        cls.college_rank = r


Student1 = Student("Student-1",70,80)
Student2 = Student("Student-2",80,90)

avg_sub1_marks = (Student1.sub1_marks + Student2.sub1_marks)/2
avg_sub2_marks = (Student1.sub2_marks + Student2.sub2_marks)/2

total_sub1_marks = Student1.sub1_marks + Student2.sub1_marks
total_sub2_marks = Student1.sub2_marks + Student2.sub2_marks

total_marks = Student1.sub1_marks + Student2.sub1_marks + Student1.sub2_marks + Student2.sub2_marks

print(" Student_1_name : ",Student1.name)
print(" Student_2_name : ",Student2.name)

print(" Student_1_College : ",Student.college)
print(" Student_2_College : ",Student.college)

print("avg_sub1_marks : ",avg_sub1_marks)
print("avg_sub2_marks : ",avg_sub2_marks)

print("total_sub1_marks : ",total_sub1_marks)
print("total_sub2_marks : ",total_sub2_marks)

print("total_marks : ",total_marks)

Student.add_college_rank(1)
print("College Rank : ",Student.college_rank)

print("-"*40)
#------------------------------------
