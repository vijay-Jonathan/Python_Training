"""
Functions summary
"""
print("#1-way")
print("-"*40)
#----------------------

def add():
    a = 10
    b = 20
    return a + b

print(add())

#----------------------
print("-"*40)


print("#2-way")
print("-"*40)
#----------------------

def add(a,b):
    return a+b

print(add(10,20))

#----------------------
print("-"*40)

print("#3-way")
print("-"*40)
#----------------------

def add(a,b=10):
    return a+b

print(add(10))
print(add(10,20))

#----------------------
print("-"*40)


print("#4-way : Function with only 0 or more positional arguments")
print("-"*40)
#----------------------

def add(*a):
    return sum(a)

print(add(10))
print(add(10,20))
print(add(10,20,30))

#----------------------
print("-"*40)

print("#4-way : Function with only 2 keyword only arguments")
print("-"*40)
#----------------------

def add(*,a,b):
    return a+b

print(add(a=10,b=20))


#----------------------
print("-"*40)

print("#5th-way : Function with 2 positional and 2 kw arguments")
print("-"*40)
#----------------------

def add(a,b,*,c,d): # Beofer * Positional, after * keyword only
    return a+b+c+d

print(add(10,20,c=30,d=40))

#----------------------
print("-"*40)

print("#6th-way : only 0 or more kw arguments")
print("-"*40)
#----------------------

def add(**a):
    return sum(a.values())

print(add(a=10,b=20,c=30,d=40))

#----------------------
print("-"*40)


print("#7th-way : only 0 or more poisitional arguments and only 0 or more kw arguments")
print("-"*40)
#----------------------

def add(*a,**b):
    return sum(a) + sum(b.values())

print(add(10,20,30,40,x=10,y=20,z=30))

#----------------------
print("-"*40)