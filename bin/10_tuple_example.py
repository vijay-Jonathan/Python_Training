"""
Core data types/predefined class/available option to store data,
In that,
we are discussing on tuple class
"""
# tuple help us to store more than one element but IMMUTABLE
# IMMUTABLE : Once we create tuple, we will not be able to alter (ADD/REMOVE/UPDATE)

T1 = (10,12.5,"Python",["a","b"],(10,20))
T2 = tuple((10,12.5,"Python",["a","b"],(10,20)))
print("Tuples are : ",T1,T2)

# Tuple also indexed like list and string. refer 4_str_class_example.py for slicing

print("Element at index 2 : ",T1[2]) # Python
print("4th char of Element at index 2 : ",T1[2][4])

print("Methods inside tuple class")
print(dir(T1))
"""
['__add__', '__class__', '__class_getitem__', '__contains__', '__delattr__', '__dir__', '__doc__', 
'__eq__', '__format__', '__ge__', '__getattribute__', '__getitem__', '__getnewargs__', '__gt__', 
'__hash__', '__init__', '__init_subclass__', '__iter__', '__le__', '__len__', '__lt__', '__mul__', 
'__ne__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__rmul__', '__setattr__', 
'__sizeof__', '__str__', '__subclasshook__', 'count', 'index']
"""
# In case of list, we had many methods which are related to add/remove/update/sort etc
# But in case of tuple, it is IMMUTABLE so those methods are not provided

T3 = (100,200,300,400,400,400)
print("count of 400 : ",T3.count(400))
print("Index of 300 : ",T3.index(300))

T4 = (500,600,700)
T5 = T3 + T4
T6 = T3.__add__(T4)
print("T5 and T6 are : ",T5,T6,sep="\n")
print("Length of tuple T3 : ",len(T3)) # Internally calls __len__

