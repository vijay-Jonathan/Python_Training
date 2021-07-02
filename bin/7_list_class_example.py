"""
List class : help us to store morethan one element
List class : MUTABLE (ADD/REMOVE/UPDATE)
"""
L1 = [10,12.5,"Python",["a","b"]] # Shortcut is []
L2 = list([10,12.5,"Python",["a","b"]])
print("Lists are : ",L1,L2,sep="\n")

# List also having indexes similar to strings.
# Please 4_str_example.py for
#  1) accessing single element
# 2) sub list 

print("Element at 1st index : ",L1[1])
print("Sub list from 1 to 4",L1[1:4])

print("Methods inside list class")
print(dir(L1))

# 'append', 'clear', 'copy', 'count', 'extend', 'index', 'insert', 'pop', 'remove', 'reverse', 'sort'


# Adding elements : 'append','extend','insert',
# To Remove : 'pop', 'remove',
# Extra Methods :  'clear', 'copy', 'count',  'index',   'reverse', 'sort'


# Adding elements : 'append','insert','extend'
L3 = [10,"Python",20,"Java"]
print("L3 before append : ",L3)
L3.append(30)
print("L3 After append : ",L3)

print("L3 Before Insert : ",L3)
L3.insert(2,200)
print("L3 After Insert : ",L3)

L4 = [1000,2000,3000,4000]
print("L4 ements : ",L4)
print("L3 Before extend : ",L3)
L3.extend(L4)
print("L3 After extend : ",L3)

print("-"*40)
#---------------------------------


# To Remove : 'pop', 'remove',
L5 =[100,"Python","Java",200]
print("L5 before pop : ",L5)
# Pop will do 2 things
#1. it will delete
#2. it will return deleted item
removed_element = L5.pop() # Remove lase element and return
# return value of pop will be captured in removed_element.

print("removed_element : ",removed_element) # 200
print("L5 After pop : ",L5) # [100,"Python","Java"]

removed_element = L5.pop(1) # "Python"
print("removed_element : ",removed_element) #"Python"
print("L5 After pop(1) : ",L5) # [100,"Java"]

print("L5 before remove : ",L5)
remove_return_val = L5.remove("Java")
print("remove_return_val : ",remove_return_val) #None
print("L5 After remove(Java) : ",L5) # [100]

print("-"*40)
#---------------------------------

print("Update")
print("-"*40)
#---------------------------------
L6 = [10,20,30]
print("L6 before update : ",L6)
L6[0]=500
print("L6 after update : ",L6)
print("-"*40)
#---------------------------------

# Extra Methods :  'clear', 'copy', 'count',  'index',   'reverse', 'sort'
print("Extra methods..")
print("L6 before clear : ",L6)
L6.clear() # empty the list
print("L6 after clear : ",L6)

L7 = [10,20,30]
# L7 is reference
# [10,20,30] is object.
print("L7 Reference id : ",id(L7))
L8 = L7 # L7 and L8 are pointing to same object
print("L7 and L8 Reference ID : ",id(L7),id(L8)) # Both are same id

L9 = L7.copy() # Create one more copy of the object
print("new list L9 is : ",L9)
print("isd of L9 and L7 : ",id(L9),id(L7))
"""
MEMORY

Example	STACK Memory	Heap Memory
a = 10	a	10
s = "Python"	s	"python"
L7 = [10,20,30]	L7,L8	[10,20,30]
L8 = L7		
L9 = L7.copy()	L9	[10,20,30]
"""

print("-"*40)
#---------------------------------

# 'count',  'index',   'reverse', 'sort'
L10 = [100,100,200,300,400,200,200,200]
c = L10.count(200) # 4
i = L10.index(200) #2
print("count of 200 : ",c)
print("index of 200 : ",i)

print("L10 before reverse : ",L10)
L10.reverse()
print("L10 After reverse : ",L10)

print("L10 Before sort : ",L10)
L10.sort() # ascending. sort(reverse=True)-descending order
print("L10 After sort : ",L10)

print("-"*40)
#---------------------------------
