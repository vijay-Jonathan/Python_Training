"""
Exceptions Handling
"""

"""
a = 10
b = 0
c = a/b # Program will terminate at this point
print("c : c")
"""
try:
    a = 10
    b = 0
    c = a / b  # Got Error, Now control will go to except block
    print("c : c")
except:
    print("Some Error")

print("Other Statements..")
print("-"*40)
#----------------------

# problem with above except block is , for any kind of error in try block,
# it will use same except block. It is very difficult to trace which type of error
# occurred, So, for that we have option of providing class names in except block.

# All exceptions are classes, predifined or user defined classes
# Super class for all exception class is : 'Exception'
# If we want to create user defined exception class then it should be sub class of
# Exception class OR Exception sub classes
# Ex: Assume X is already Excetion class created using Exception. Now we can X
# As a super class to create our exception

print("try-except with classes")
print("-"*40)
#----------------------
d = 10
#e = 0
try:
    f = d/e
    print("f : ",f)
except ZeroDivisionError: #
    print("ZDE")
except NameError as ne: # capture thrown object in 'ne' variable
    print("Name error : ",ne)
except (KeyError, IndexError):
    print("Either KE or IE")
except:
    print("Some error")

print("-"*40)
#----------------------

print("try-except-else")
print("-"*40)
#----------------------
# try faile means except will execute else block will be skipped
# try Success means else will execute except block will be skipped
g=10
h=0
try:
    i = g/h
    print("i : ",i)
except ZeroDivisionError:
    print("ZDE")
else:
    print("In Else")

print("-"*40)
#----------------------

print("try-except-finally")
print("-"*40)
#----------------------
j = 10
k = 0
try:
    l = j/k
    print("j : ",j)
except:
    #l = j / k # Program terminate here. If we want, we can write try/excpt here as well
    print("In except")
finally:
    print("In finally")


print("-"*40)
#----------------------

print("assert statement")
print("-"*40)
#----------------------
test_result = "Test Case Failure"
try:
    assert "Success" in test_result, "Since test case failed, raising assertion error"
    # if condition failed the throw assertion error with message given above
    print("Test completed successfully")
    print("proceeding to next statements")
except AssertionError as ae:
    print("ae : ",ae)

print("-"*40)
#----------------------

print("raise statement")
print("-"*40)
#----------------------

q = 10
r = 0
try:
    if r == 0:
        raise ZeroDivisionError # Manually throw
    print("stmt-1")
    print("stmt-2")
    print("stmt-3")
    print("stmt-99")
    print("stmt-100")
    s = q/r # if r=0, after executing 100 statemens it will throw error
except:
    print("From raise ")

# Note : raise is also used to throw custom exceptions
print("-"*40)
#----------------------

print("Custom Exceptions - Example-1")
print("-"*40)
#----------------------

class MyError(Exception):
    pass

x = 10
y = 0
try:
    if y == 0:
        raise MyError("This is MyError, y is 0") # MyError will call Super class(Exception) __init__
except MyError as me:
    print("me is : ",me)


print("-"*40)
#----------------------

print("Custom Exceptions - Example-2")
print("-"*40)
#----------------------

class MyError(Exception):
    def __init__(self,m):
        self.msg=m
    def __str__(self):
        return "Hello There is ERROR and Desc : " + self.msg

x = 10
y = 0
try:
    if y == 0:
        raise MyError("This is MyError, y is 0") # MyError will call Super class(Exception) __init__
except MyError as me:
    print("me is : ",me) # It will call __str__,

print("-"*40)
#----------------------
