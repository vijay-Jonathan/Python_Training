"""
Operator Overloading

# Each operator in python mapped to some names
# those names starting with __ and ending with __
# for Ex: + is mapped to __add__
# if we want support + operator with our own class objects then
# we need to write __add__ method inside the class
"""

class Student:
    def __init__(self,n):
        self.name = n
    def __add__(self, other): # self--> s1 and other--> s2
        return self.name + other.name

s1 = Student("Student-1")
s2 = Student("Student-2")
result = s1 + s2 # Internally, s1.__add__(s2)
print("result : ",result)
