"""
Decorators
"""
print("Without Decorator")
print("-"*40)
#----------------------

def add(a,b):
    print("Result is : ")
    print(a+b)
    print("End of the result")

def sub(a,b):
    print("Result is : ")
    print(a-b)
    print("End of the result")

add(10,20)
sub(10,20)

# In all functions, we statments/logic/code are common
# How to reuse those common code
print("-"*40)
#----------------------

print("Using Decorator pattern")
print("-"*40)
#----------------------

# Creating function as per decorator pattern

def my_decorator(func):
    def decorated_func(x,y):
        print("Result is : ")
        func(x,y)
        print("End of the result")
    return decorated_func


@my_decorator
def add(a,b):
    print(a+b)

@my_decorator
def sub(a,b):
    print(a-b)

add(10,20)
sub(10,20)

print("-"*40)
#------------------------

print("Manually executing to understand")
print("-"*40)
#----------------------

# what @my_decorator will do?

def my_decorator(func): # func=add1
    def decorated_func(x,y): # inner_func(10,20)
        print("Result is : ")
        func(x,y) # add1(10,20)
        print("End of the result")
    return decorated_func

# To UNDERSTAND, we are calling above function manually

def add1(a,b):
    print(a+b)

inner_func = my_decorator(add1) # func=add1
# inner_func = decorated_func

# Let me call inner function
inner_func(10,20) # x=10,y=20

print("-"*40)
#----------------------

    

