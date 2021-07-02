"""
Till Day-3 Summary
"""
print("Core Data Types")
print("Numbers")
a = 10
b = int(20)
print(a,b)

print("-"*40)

print("Strings")
c = "Python"
d = str("Python")
print(c,d)
print("Methods inside str class")
print(dir(c))

print("-"*40)

# Variable --> Directly
# Function --> Directly call
# Class --> Group of functions (Called Methods)--> 1) create object, 2)on that object call methods

print("List")
L1 = [10,20,30]
L2 = list([10,20,30])
print(L1,L2)
print("Methods inside list class")
print(dir(L1))

print("-"*40)

print("Tuple")
T1 = (10,20,30)
T2 = tuple((10,20,30))
print(T1,T2)
print("Methods inside the tuple class")
print(dir(T1))

print("-"*40)

print("Dict class")
D1 = {"A" : 10, "B" : 20}
D2 = dict({"A" : 10, "B" : 20})
print(D1,D2)
print("Methods inside dict class")
print(dir(D1))

print("-"*40)

#1) SQL Databases :  - Where we are creating table,
#                            - inside tables we are storing the data
#                            - Using SQL queries to communicate with data base
#                               Example : sqlite, mysql, oracle etc
#                           Example :bank :- Fixed number of tables are enough.
#                           Example : SB account, they will create one table, and add new customer to it.
#                           IT IS UNDER BANKS CONTROL

#2) No-SQL Databases :  - No tables
#                                   - inside document only we are storing data in KEY/VALUE form
#                                   - No - SQL : SQL queries are not required
#                                   Example : mongoDB etc..
#                                   - Easily scalable (easily we can increase/decrease the size)
#                               Example : slack, facebook, whatsapp many more where we dont know
#                               How many groups/channels/posts are coming. It is in users HAND. Based
# on users request, we need to store/create/delete data
#                               It is in users HAND.
#                               - NO-SQL Databases will be easier in these cases

print("-"*40)

print("Set class")
S1 = {10,10,10,20,30}
S2 = set({10,10,10,20,30})
print(S1,S2)
print("Methods inside set class")
print(dir(S1))

print("-"*40)

print("frozenset class")
S1 = frozenset({10,10,10,20,30})
print(S1)
print("Methods inside frozenset class")
print(dir(S1))

print("-"*40)

print("if-conditional stmt")
x = 10
if x == 10:
    pass # Since we dont have {}, To keep any block empty
if x == 10:
    print("x is 10")

# if
# if-elif
#if-elif-else
#if-else

print("-"*40)

print("for loop")
# iterate over any collection
s = "Python"
for i in s:
    print("In for : ",i)

# break
# continue - goto next iteration

print("-"*40)

print("While loop")
x = 0
while x < 10:
    print("x in while : ",x)

# break
# continue

print("-"*40)

print("File operations")
# From program, connecting/interacting with external file
# text file with any extension like .txt, .csv, .mylog, .youlog

# 3 steps
# Step-1 : connect (open func)
# Step-2 : Do RW (Many ways)
# Step-3 : Disconnect (close)

print("-"*40)

print("Functions")
print("-"*40)
# If we want to repeat same code more than one time
#def add()
#def add(a,b)
#def add(a,b=10)
#def add(a,b=10,*c) # like print
#def add(a,b=10,*c,d,e)
#def add(a,b=10,*c,d,e=10)
#def add(a,b=10,*c,d,e=10,**f)
#def add(*,d,e)
#def add(*a)
#def add(**a)
#def add(*a,**b)
#def add(a,b, * ,d,e)

print("-"*40)

print("Modules and Packages")
print("-"*40)

# Module : - Python file having only 0 or more variables/functions definition/class definion
# Packages :- Folder having python modules
# WHY - Module/.Package? We can reuse same code in more than one project

# Library : General term
# One or more module like MyModule.py also called Library
# One or more package like MyPackage also called Library
# Framework also called Library. (In framework, not only definitions, it also having
# some part of the code is implemented)

print("-"*40)

print("Complete Python Programming Language Structure")
# Part-1 : Programming (datatypes,if,for,while,functions,classes,except etc)
# Part-2 : Builtins
# Part-3 : standard libraries
# Part-4 : 3rd Party Library (Pypi.org, Installing using pip)
# Part-5 : Custom libraries.

print("-"*40)