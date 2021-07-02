"""
In this section we are discussing about for loop.
for loop help us to iterate over any collection.
"""
s = "Python" # collection of characters
print("Accessing each character without for loop")
print("-"*40)
#---------------------

print("Each char : ",s[0])
print("Each char : ",s[1])
print("Each char : ",s[2])
print("Each char : ",s[3])
print("Each char : ",s[4])
print("Each char : ",s[5])

print("-"*40)
#---------------------

print("Accessing each character using for loop")
print("-"*40)
#---------------------

for i in s:
    print("Each char : ", i)

print("-"*40)
#---------------------

print("for with any collection")
print("-"*40)
#---------------------

L = [10,20,30]
for i in L:
    print("i : ",i)

print("-"*40)
#---------------------

print("Dictionary")
print("-"*40)
#---------------------

D = {"A" : 10 , "B" : 20}
for k in D: #for k in D.keys(): ["A" , "B "]
    print("Key : ",k)
    print("Value : ",D[k])

for v in D.values(): #[10,20]
    print("v : ",v)

for i in D.items(): # [ ("A" , 10) , ("B" , 20) ] - 1st iteration = ("A" , 10)
    print("item is : ",i) # i = ("A" , 10 ), # i[0] = "A", i[1] = 10
    print("key in item : ",i[0])
    print("value in item : ", i[1])

for k, v in D.items(): # [ ("A" , 10) , ("B" , 20) ] -
    # 1st iteration = ("A" , 10) --> "A" --> k, 10-->v
    # 2nd iteration = ("B" , 20) --> "B" --> k, 20-->v
    print("Key is : ",k)
    print("Values is : ",v)

student_names = ["student-1" , "student-2" , "student-3" , "student-4" ]
student_usn = ["student-1-usn" , "student-2-usn" , "student-3-usn" , "student-4-usn" , ]

# iterate both the list at a time. means in each iteration, we need one element from each list
# WE CAN'T write for loop like for s,u in  student_names,  student_usn == WRONG for loop
# so we need to pair
"""
>>> student_names = ["student-1" , "student-2" , "student-3" , "student-4" ]
>>> student_usn = ["student-1-usn" , "student-2-usn" , "student-3-usn" , "student-4-usn" , ]
>>> z = zip(student_names,student_usn)
>>> list(z)
[('student-1', 'student-1-usn'), ('student-2', 'student-2-usn'), ('student-3', 'student-3-usn'), ('student-4', 'student-4-usn')]
>>> 
"""

for s,u in zip(student_names,student_usn):
    print("Student Name : ", s , "Student USN : ",u)

print("-"*40)
#---------------------

# for loop will end after completing all the elements
# IN SOME SCENARIO, WE may need to end the for loop in between
# then we can make use of break statement

print("Without break statement")
print("-"*40)
#---------------------

my_companies = ["IBM" , "Sling India", "SAP" , "Sling US"]

# if "Sling India" in my_companies:
# But here we know pnly the starting word sling,
# findout are there any element starting with sling.
for i in my_companies:
    if i.startswith("Sling"):
        print("Found")
# It prints found twice but one element found means it is found only,
# not required to check remaining elements. So once we find the element then we
# need to comeout of for loop

print("-"*40)
#---------------------

print("Using break statement")
print("-"*40)
#---------------------

for i in my_companies:
    if i.startswith("Sling"):
        print("Found")
        break

print("-"*40)
#---------------------

# Normally, In each iteration, for loop will execute all statements inside for loop
# then only it will go for next iteration.

# In some scenario, we dont want to execute all statements,
# instead we need to skip current iteration and go for next iteration

# We can make use of 'continue' statement

print("Without continue statement")
print("-"*40)
#---------------------
my_companies = ["IBM" , "Sling India", "SAP" , "Sling US"]

for i in my_companies:
    # The below statement are related to sling company
    print("Company name is : ",i)
    print("sling is having head quarters in US")
    print("sling is having offices in some locations")
    print("sling is having xyz employess")

print("-"*40)
#---------------------

print("With continue statement")
print("-"*40)
#---------------------
my_companies = ["IBM" , "Sling India", "SAP" , "Sling US"]

for i in my_companies:
    if not i.startswith("Sling"):
        continue # Skip current iteration and goto next iteration (Start from for begining)
    # The below statement are related to sling company
    print("Company name is : ",i)
    print("sling is having head quarters in US")
    print("sling is having offices in some locations")
    print("sling is having xyz employess")

print("-"*40)
#---------------------

print("Other language for loop(for i=2;i<10;i+2)")
print("In some cases we can achieve using range BUT NOT all the cases")
print("We need to use while loop for remaining cases")
print("-"*40)
#---------------------
"""
>>> 
>>> r1 = range(10)
>>> list(r1)
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
>>> r2 = range(2,10)
>>> list(r2)
[2, 3, 4, 5, 6, 7, 8, 9]
>>> r3 = range(2,20,2)
>>> list(r3)
[2, 4, 6, 8, 10, 12, 14, 16, 18]
>>> 
"""

# for i=2;i<10;i+2
for i in range(2,10,2):
    print("i : ",i)
    i = 100 # NO IMPACT, Next iteration will take value from range only, not 100
    # This i = 100 case can be achiebed in while loop

print("-"*40)
#---------------------