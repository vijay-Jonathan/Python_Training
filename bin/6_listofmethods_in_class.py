"""
In a program, we can have
1. variable:  Ex :- a=10, print(a)
2. function: Ex :- print("Hi"), len("Python")
3. class : Ex :- a = str("Python"), a.startswith()
    # We can say class is having 0 or more functions -- instead of calling functions, we are calling methods

How to list all the methods inside any class ?
"""

a = "Python"
# OR
a = str("Python")
print(dir(a))

"""
Methods inside str class
['__add__', '__class__', '__contains__', '__delattr__', '__dir__', '__doc__', '__eq__', '__format__', '__ge__',
'__getattribute__', '__getitem__', '__getnewargs__', '__gt__', '__hash__', '__init__', '__init_subclass__',
'__iter__', '__le__', '__len__', '__lt__', '__mod__', '__mul__', '__ne__', '__new__', '__reduce__', '__reduce_ex__',
'__repr__', '__rmod__', '__rmul__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', 'capitalize',
'casefold', 'center', 'count', 'encode', 'endswith', 'expandtabs', 'find', 'format', 'format_map', 'index',
'isalnum', 'isalpha', 'isascii', 'isdecimal', 'isdigit', 'isidentifier', 'islower', 'isnumeric', 'isprintable', 'isspace',
'istitle', 'isupper', 'join', 'ljust', 'lower', 'lstrip', 'maketrans', 'partition', 'removeprefix', 'removesuffix', 'replace',
'rfind', 'rindex', 'rjust', 'rpartition', 'rsplit', 'rstrip', 'split', 'splitlines', 'startswith', 'strip', 'swapcase', 'title',
'translate', 'upper', 'zfill']
"""

# Why __ names inside the class??
# Answer: Few methods are mapped to some operator, That operator internally calling these kind of methods.
# Just to differentiate, which methods mapped method and which one is not mapped. 

print("Operator Overloading method __add__")
s1 = "Hello"
s2 = "Python"
result1 = s1 + s2 # internally, +--> mapped to __add__. + will execute __add__
result2 = s1.__add__(s2) # Manually we are calling
print(result1,result2)

