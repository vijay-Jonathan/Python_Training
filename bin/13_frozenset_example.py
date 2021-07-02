"""
We are discussing about core data types,
That too
frozenset
- It is set but IMMUTABLE (WE CAN'T MODIFY)
"""

S1 = frozenset({10,10,10,20,30,40})
print("frozenset S1 : ",S1)

print("Methods inside frozenset : ")
print(dir(S1))
"""
['__and__', '__class__', '__class_getitem__', '__contains__', '__delattr__', '__dir__', '__doc__',
 '__eq__', '__format__', '__ge__', '__getattribute__', '__gt__', '__hash__', '__init__', 
 '__init_subclass__', '__iter__', '__le__', '__len__', '__lt__', '__ne__', '__new__', '__or__',
  '__rand__', '__reduce__', '__reduce_ex__', '__repr__', '__ror__', '__rsub__', '__rxor__', 
  '__setattr__', '__sizeof__', '__str__', '__sub__', '__subclasshook__', '__xor__',
   'copy', 'difference', 'intersection', 'isdisjoint', 'issubset', 'issuperset', 'symmetric_difference', 
   'union']
"""
# When we copare with set,we dont have methods which alters set.
S3 = frozenset({10,20,30,40})
S4 = frozenset({30,40,50,60})

print("S3 : ",S3)
print("S4 : ",S4)

print("Union of S3 & S4 : ",S3.union(S4)) # {10,20,30,40,50,60}
print("Intersection of S3 & S4 : ",S3.intersection(S4)) # {30,40}
print("Difference os S3 & S4 (S3-S4): ",S3.difference(S4)) # {10,20} There is S3, not in S4
