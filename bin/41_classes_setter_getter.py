"""
Suppose, in 40th example,
first we need to create empty object, and later/throught the program we may need
to store data inside the object.

# In this case, anyway internally it is creating the object when we call classname.
# Initializing is not required.
"""
class Student:

    def add_student_name(self,n):
        self.name = n

    def add_sub1_marks(self,s1):
        self.sub1_marks =s1

    def add_sub2_marks(self,s2):
        self.sub2_marks =s2

    def get_student_name(self):
        return self.name

    def get_sub1_marks(self):
        return self.sub1_marks

    def get_sub2_marks(self):
        return self.sub2_marks


Student1 = Student()
Student2 = Student()

Student1.add_student_name("Student-1")
Student1.add_sub1_marks(70)
Student1.add_sub2_marks(80)

Student2.add_student_name("Student-2")
Student2.add_sub1_marks(80)
Student2.add_sub2_marks(90)

# Accessing through methods
avg_sub1_marks = (Student1.get_sub1_marks() + Student2.get_sub1_marks())/2
avg_sub2_marks = (Student1.get_sub2_marks() + Student2.get_sub2_marks())/2

#avg_sub1_marks = (Student1.sub1_marks + Student2.sub1_marks)/2
#avg_sub2_marks = (Student1.sub2_marks + Student2.sub2_marks)/2

total_sub1_marks = Student1.get_sub1_marks() + Student2.get_sub1_marks()
total_sub2_marks = Student1.get_sub2_marks() + Student2.get_sub2_marks()

# total_sub1_marks = Student1.sub1_marks + Student2.sub1_marks
# total_sub2_marks = Student1.sub2_marks + Student2.sub2_marks

total_marks = Student1.get_sub1_marks() + Student2.get_sub1_marks() + Student1.get_sub2_marks() + Student2.get_sub2_marks()

print(" Student_1_name : ",Student1.name)
print(" Student_2_name : ",Student2.name)

print("avg_sub1_marks : ",avg_sub1_marks)
print("avg_sub2_marks : ",avg_sub2_marks)

print("total_sub1_marks : ",total_sub1_marks)
print("total_sub2_marks : ",total_sub2_marks)

print("total_marks : ",total_marks)

print("-"*40)
#------------------------------------

