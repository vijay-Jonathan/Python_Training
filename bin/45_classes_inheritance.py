"""
Assume, class Student is developed and given to client (release to client)
few days /months/years ago,
Now,
client is asking to add new features to Student class.
Say add aadhaar number/get aadhaar number

How to update the exisiting class
OPTION : 1) Alter exisiting class : BUT we dont know, our changes impact on exisiting code.
So, idealy updating exisiting class will give problem and not a good idea.

OPTION : 2) SOLUTION is INHERITANCE :
    - Extend exisitng class
     - create new,
     - add new methods/feature
     - test your new class and release to client
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

# Here i copied exisitng, we can import also
# Mystudent is inheriting from Student class
class MyStudent(Student): # Now, MyStudent class responsibilities to
    # take all methods/variables from Student class to current class
    def add_aadhaar(self,a):
        self.aadhaar = a
    def get_aadhaar(self):
        return self.aadhaar

# Now, if we create object of MyStudent class, Everything in Student class and
# Current class both should work
Student1 = MyStudent("Student-1",70,80)
Student2 = MyStudent("Student-2",80,90)

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

Student1.add_aadhaar("A1")
Student2.add_aadhaar("A2")

print("Student-1 Adhaar : ",Student1.get_aadhaar())
print("Student-2 Adhaar : ",Student2.get_aadhaar())
print("-"*40)
#------------------------------------

# import MyModule
# class MyStudent(MyModule.Student)

# import MyModule as mm
# class MyStudent(mm.Student)

#------------------------------------
