"""
This is another project
In this project we need to reuse the code defined inside MyModule.py

How???
1-way : copy /paste : -- WRONG -- difficult solve all dependencies inside the module
2-way : There option to import, without copy paste
"""

print("1-way to import")
print("-"*40)
#----------------------

import MyModule
# import will run complete MyModule.py
# It brings all objects (function object/variables/classes) to current program space
print("college_name : ",MyModule.college_name)
print("my_student_func : ",MyModule.my_student_func(50,60))

print("-"*40)
#----------------------

print("2nd-way to import")
print("-"*40)
#----------------------
import MyModule as mm

print("college_name : ",mm.college_name)
print("my_student_func : ",mm.my_student_func(50,60))

print("-"*40)
#----------------------

print("3rd-way to import")
print("-"*40)
#----------------------

from MyModule import college_name,my_student_func

print("college_name : ",college_name)
print("my_student_func : ",my_student_func(50,60))

print("-"*40)
#----------------------

print("4th-way to import")
print("-"*40)
#----------------------

from MyModule import college_name as cn, my_student_func as msf

print("college_name : ",cn)
print("my_student_func : ",msf(50,60))

print("-"*40)
#----------------------

print("5th-way to import")
print("-"*40)
#----------------------

from MyModule import *

print("college_name : ",college_name)
print("my_student_func : ",my_student_func(50,60))

print("-"*40)
#----------------------

# Scenarios where we are working on BIGGG project & deleoping more and more
# modules and
# we need to store all module in organized way (creating subdirectories etc.. and
# keeping like how we store songs/movies/.mp3/mp4 files)

# SOLUTION : We can also create seperate folders/subfolders and store all modules.
# Since these directories having only modules, we are calling it as "PACKAGES"
# PACKAGES : are nothing but directory. It will be having only python modules like MyModule.py
# And also there is a option to directly import from PACKAGE

# How to import from package?

print("1-way to import")
print("-"*40)
#----------------------

import MyPackage.googlecloud.MyModule

print("college_name : ",MyPackage.googlecloud.MyModule.college_name)
print("my_student_func : ",MyPackage.googlecloud.MyModule.my_student_func(50,60))

print("-"*40)
#----------------------


print("2nd-way to import")
print("-"*40)
#----------------------
import MyPackage.googlecloud.MyModule as mm

print("college_name : ",mm.college_name)
print("my_student_func : ",mm.my_student_func(50,60))

print("-"*40)
#----------------------

print("3rd-way to import")
print("-"*40)
#----------------------

from MyPackage.googlecloud.MyModule import college_name,my_student_func

print("college_name : ",college_name)
print("my_student_func : ",my_student_func(50,60))

print("-"*40)
#----------------------

print("4th-way to import")
print("-"*40)
#----------------------

from MyPackage.googlecloud.MyModule import college_name as cn, my_student_func as msf

print("college_name : ",cn)
print("my_student_func : ",msf(50,60))

print("-"*40)
#----------------------

print("5th-way to import")
print("-"*40)
#----------------------

from MyPackage.googlecloud.MyModule import *

print("college_name : ",college_name)
print("my_student_func : ",my_student_func(50,60))

print("-"*40)
#----------------------
