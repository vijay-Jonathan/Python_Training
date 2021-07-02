"""
Client Requirement : for 39,40,41st example, add variable to store college name
- Assume all students are from same college Ex: college="Xyz college"

We have now two types of object here:
1) Student -> class object. data inside Student class can be accessed by all instance objects
2) Instance Object -> Student1,Student2,..Student1000..lakhs etc,

Where to store college name?
class object student OR all instance objects???

college variable is same for all students, instead of stroing in all instance objects (waste of memory),
We can store in class object

Variable declared inside class like college - called CLASS VARIABLE
"""
class Student:
    college = "Xyz College"
    def __init__(self,n,s1,s2):
        self.name = n
        self.sub1_marks = s1
        self.sub2_marks = s2

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

print("-"*40)
#------------------------------------
