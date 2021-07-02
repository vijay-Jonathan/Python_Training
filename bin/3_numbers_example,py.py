"""
First multiline comment of the file, we will use it for providing description about this file (DOCUMENTATION).
This first multiline comment is also called "DOC-STRING"
ALSO
First multiline comment of the function
First multiline comment of the class
are also used for documenting purposes

Finally,
In this section, we are discussing about
Core Data Types, That too
1. Numbers -- int, float etc
"""

a = 10
b = 12.5
c = 0x12
d = 0b1010
e = 0o12
print("a is : ",a)
print("b is : ",b)
print(a,b,c,d,e)

print("2nd Point")
print('-----------------')
a = 10
# Internally it calls class name to create a object
b = int(10) # same as b = 10. Here we are manually calling class name

c = 12.5
d = float(12.5)

print(a,b,c,d) # When it print, Each element will be seperated by SPACE
print(a,b,c,d,sep="|") # When it print, Each element will be seperated by |
print(a,b,c,d,sep="XYZ") # When it print, Each element will be seperated by XYZ

print('-----------------')

print("3rd Point about print function")
print('-----------------')

print("hello","hello","hello") # default value for sep = "ONE SPACE", default value for end="\n". After printing all the elements, cursor will goto next line
print("hi","hi","hi",sep="|",end=".") # sep = "|", end=".". After printing all the elements, it will put DOT (.) at the end. And cursor will be on same line
print("Python","Python","Python") # This will print on the same line above ouput

# We can pass sep, end, file, flush parameters to print function
# file, flush option will be discussed during file operations
print('-----------------')
