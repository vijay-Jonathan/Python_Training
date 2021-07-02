"""
Generators
"""

def my_squares(M):
    result=[]
    for i in M:
        result.append(i*i)
    return result

L = [1,2,3,4]
my_squares_result = my_squares(L)
import sys
# To save memory, instead of creaing all the objects and storing in my_squares_result
# are there any way where i can get one element/object  created whenever we want
for i in my_squares_result: # In this case, even for loop need one element, other objects are also already avaiable in list
    print("Processing each element i is : ",i)

print("Size of my_squares_result : ",sys.getsizeof(my_squares_result))


print("-"*40)
#------------------------
# It is really required to generate object on the fly when we are working with huge data
# where we concerned about memory
# SOLUTION : GENERATORS

print("Using Generator")
print("-"*40)
#------------------------

def my_squares(M):
    for i in M:
        yield i*i

L = [1,2,3,4]
my_squares_result = my_squares(L)
import sys
for i in my_squares_result:
    print("Processing each element i is : ",i)

print("Size of my_squares_result : ",sys.getsizeof(my_squares_result))


print("-"*40)
#------------------------