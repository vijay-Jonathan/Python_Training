"""
MyStudent class need to have methods to add persnal details.
Not required to write code for personal details,
We already have Exisitng class called personal, We can inherit from this class
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

class MyStudent(Student):
    def add_aadhaar(self,a):
        self.aadhaar = a
    def get_aadhaar(self):
        return self.aadhaar

class Personal:
    def add_phone(self,p):
        self.mobile_no = p
    def get_phone(self):
        return self.mobile_no

# Client wants everithinh=g in Student and MyStudent, with that client need
# Personal class also

class NewStudent(MyStudent,Personal): # Left to Right
    # We are overriding method present in Personal class -> Polymorphism
    # Polymorphism --> allow us to define same method name as super class
    def get_phone(self):
        return "+91" + self.mobile_no

Student1 = NewStudent("Student-1",70,80)
Student2 = NewStudent("Student-2",80,90)

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

Student1.add_phone("9999999999")
print("Student1 Phone : ",Student1.get_phone())

print("-"*40)
#------------------------------------
