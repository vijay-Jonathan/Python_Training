"""
Full class if we want to share with more projects then we can keep in
module and import.

Now,
suppose partial class, i need to share where few methods are common among
many projects then only common methods we can implement, remaining methods
we can keep it empty and share.

Those who are using, they provide implementation to remaining methods and they
will use.

Problem in creating partial implemented class is, by mistake without providing
implementation to those methods then this class will lead to WRONG result

At anycost, we need to make sure, those who are using , they will provide
implementation and they will use

To restrict, using class without implementing, we have option called abstract
classes.

If we share abstract class then it will not allow to create object till we provide
implementation to incomplete methods.
"""

class Student:
    def set_student_name(self,n):
        self.name =n

    def get_student_name(self):
        pass
        """
        We can't provide implementation, because this implentation will differs 
        based on the requirement.
        Ex: Some project/client ask us to return with "Welcome " + Student_name
        # Some project/client ask us to return with "Good Morning " + Student_name
        """

print("Without implementing, get_student_name, we can create object")
s1 = Student()

print("-"*40)
#-----------------------------------
print("We will create abstract class")
from abc import abstractmethod, ABC
class Student(ABC): # Step-1 : Make subclass
    def set_student_name(self,n):
        self.name =n

    @abstractmethod # Step-2
    def get_student_name(self):
        pass

"""
s2 = Student()

Traceback (most recent call last):
  File "C:\Python_Training\bin\48_classes_abstract_classes.py", line 54, in <module>
    s2 = Student()
TypeError: Can't instantiate abstract class Student with abstract method get_student_name
"""

print("Implementing  abstract class..")
# Step-1 : create sub class of abstract
# Step-2 : Provide implementation to all abstract methods
class MyStudent(Student):
    def get_student_name(self):
        return "Hello " + self.name

s3 = MyStudent()
s3.set_student_name("Stud-3")
print("Student name : ",s3.get_student_name())
