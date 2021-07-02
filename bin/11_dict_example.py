"""
In this section, we are discussing about core data types
That too
dict class - Dictionary class

It also help us to store morethan one element, but We need to provide index also. called KEY
- json data
- no-sql db data
- many scenarios/projects require to store data providing key as well
Example: Student data where we need to provide USN as index/Key
{"usn1":["name","marks","grade"], "usn2":["name","marks","grade","college"], }

"""

D1 = {"course" : "Python",    "Duration" : 5,      "Mode" : "online"}
D2 = dict({"course" : "Python",    "Duration" : 5,      "Mode" : "online"})

# for each value, manually we need to provide index/key
# key can be any immutable value like numbers/strings/tuple.
# in our example, we used string as key like "course","Duration" etc.

print("Dictionaries are : ",D1,D2,sep="\n")

# How to access each element ?
print("course : ", D1["course"])
print("Duration : ", D1["Duration"])
print("Mode : ", D1["Mode"])
print("4th char of course : ", D1["course"][4])

print("Methods inside dict class")
print(dir(D1))

"""
['__class__', '__class_getitem__', '__contains__', '__delattr__', '__delitem__', '__dir__', 
'__doc__', '__eq__', '__format__', '__ge__', '__getattribute__', '__getitem__', '__gt__', 
'__hash__', '__init__', '__init_subclass__', '__ior__', '__iter__', '__le__', '__len__', '__lt__',
 '__ne__', '__new__', '__or__', '__reduce__', '__reduce_ex__', '__repr__', '__reversed__', 
 '__ror__', '__setattr__', '__setitem__', '__sizeof__', '__str__', '__subclasshook__', 
 'clear', 'copy', 'fromkeys', 'get', 'items', 'keys', 'pop', 'popitem', 'setdefault', 'update', 'values']
"""

print("Adding Element to D1 : ")
print("D1 before add : ",D1)
D1["author"] = "Abc Author"
print("D1 after add : ",D1)

print("Updating D1 course to java & c++ : ")
print("D1 Before update : ",D1)
# Only Java means, D1["course"] = "Java"
# Only C++ means, D1["course"] = "C++"
# But we need to store more than one element
# Then we can tuple/list/set etc
D1["course"] = ["Java" , "C++"]
print("D1 After update : ",D1)

# Adding new element OR updating existing elements, both look similar
# idealyy, check whehter key is present, if present update else add new key

# 'pop', 'popitem',
print("D1 before delete using pop : ",D1)
# pop -->1) delete from dictionary 2)return deleted element
deleted_element = D1.pop("course")
print("D1 after deleting course using pop : ",D1)
print("deleted_element : ", deleted_element)

print("D1 before delete using popitem : ",D1)
deleted_element = D1.popitem()
print("D1 after deleting last element using popitem : ",D1)
print("deleted_element : ", deleted_element)

D3 = {"course" : ["Python","Java","C++"],    "Duration" : 5,      "Mode" : "online"}
print("D3 before deleting course 'Java' : ",D3)
print("Content of course : ",D3["course"])
# D3["course"] is list, so we can use list class methods to delete java
# in this is case java is in 1st index
removed_element = D3["course"].pop(1)
print("D3 after deleting java : ",D3)

