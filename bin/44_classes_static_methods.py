"""
Client Requiremnt is :for 43rd example, add method to compute percentage,
if student pass marks, method should return percentage.

Now,

for this compute_percentage method, not required to pass instance object OR
class object, only passing 2 marks is enough method will return perecnetage.

Other methods inside the class is receiving either instance object/class object,
because, in those methods we are either storing some values inside the object/
reading varaible values from the object

But,
In this case, we dont need class/instance object. Uncessarily if we pass
any object to method, it will also occupy memory.
In this case we can write method wchi will not take any instance/class method as
first argument
i.e : STATIC METHODS
"""

class Student:
    college = "Xyz College"
    def __init__(self,n,s1,s2):
        self.name = n
        self.sub1_marks = s1
        self.sub2_marks = s2

    @classmethod
    def add_college_rank(cls,r):
        cls.college_rank = r

    @staticmethod
    def compute_percentage(marks1,marks2):
        return ((marks1+marks2)/200)*100

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

s1_per = Student.compute_percentage(Student1.sub1_marks,Student1.sub2_marks)
print("Student  1 Percentage : ",s1_per)

print("-"*40)
#------------------------------------


