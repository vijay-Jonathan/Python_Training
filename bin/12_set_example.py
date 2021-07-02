"""
In this section, we are discussing about core data types
That too,
set class
- set help us to store more than one element
- keeps unique elements
- methods related to set operations like union, difference, intersection etc..
- WE DONT HAVE INDEX/KEY TO access individual elements. we can use loops/convert to list/tuple

"""
S1 = {10,10,10,10,20,30,40} # {Key/value pair then dictionary}
S2 = set({10,10,10,10,20,30,40})

print("Sets are : ", S1, S2, sep="\n")

# - WE DONT HAVE INDEX/KEY TO access individual elements.
#  we can use loops/convert to list/tuple

print("Methods inside set class")
print(dir(S1))
"""
['__and__', '__class__', '__class_getitem__', '__contains__', '__delattr__', '__dir__', '__doc__',
 '__eq__', '__format__', '__ge__', '__getattribute__', '__gt__', '__hash__', '__iand__', '__init__', 
 '__init_subclass__', '__ior__', '__isub__', '__iter__', '__ixor__', '__le__', '__len__', '__lt__', 
 '__ne__', '__new__', '__or__', '__rand__', '__reduce__', '__reduce_ex__', '__repr__', '__ror__',
  '__rsub__', '__rxor__', '__setattr__', '__sizeof__', '__str__', '__sub__', '__subclasshook__', 
  '__xor__', 
  'add', 'clear', 'copy', 'difference', 'difference_update', 'discard', 'intersection', 
  'intersection_update', 'isdisjoint', 'issubset', 'issuperset', 'pop', 'remove', 
  'symmetric_difference', 'symmetric_difference_update', 'union', 'update']
"""
print("S1 before adding 500 : ",S1)
S1.add(500)
print("S1 after adding 500 : ",S1)

S3 = {10,20,30,40}
S4 = {30,40,50,60}

print("S3 : ",S3)
print("S4 : ",S4)

print("Union of S3 & S4 : ",S3.union(S4)) # {10,20,30,40,50,60}
print("Intersection of S3 & S4 : ",S3.intersection(S4)) # {30,40}
print("Difference os S3 & S4 (S3-S4): ",S3.difference(S4)) # {10,20} There is S3, not in S4
