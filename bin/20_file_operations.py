"""
Till now,
we were storing data in a varaible and displaying output in shell/console.

Now,
We will write a program to interact with external file (any text file(not excel file and all) extension like .txt,.csv,.log etc)

Program --Communicate (READ/WRITE)-->  External file
Steps:
Step-1 : Connect to file (open function)
Step-2 : Do read/Write (Many ways)
Step-3 : Disconnect (close function)
"""
# To write-> 3 ways (write, writelines,print)
# 1-way - write
#-------------------------------

# Step-1 : Connect to file (open function)
#-------------------------------
# F = open("filename(Current dir)/filepath(If in different directory)","mode")
F1 = open("out1.txt","w")
print("Conncetion with out1.txt opened")
# Mode - w -> Write only
# In w mode, it will always create empty file. Even if the file present with the data,
# "w' mode will erase and open empty file
#-------------------------------

# Step-2 : Do read/Write (Many ways)
x = 10
s = "Python\n"
# Convert x = 10 to string. because write & writelines takes only strings
x = str(x) + "\n"
F1.write(x) # send data to buffer
F1.write(s) # send data to buffer
F1.flush() # Send data from buffer to file out1.txt
print(f"Wrote {x} and {s} to out1.txt using write method")

# 2-way - writelines
L =[x,s]
F1.writelines(L) # We can pass collection of lines/elements
print(f"Wrote {x} and {s} to out1.txt using writelines method")

# 3 - way - print function
print(20,"Java",sep="\n",file=F1,flush=True) # Send data from buffer
print(f"Wrote '20' and 'java' to out1.txt using print method")
#-------------------------------

# Step-3 : Disconnect (close function)
#-------------------------------
F1.close()
print("Conncetion with out1.txt closed")

##########################################################
# READING
##########################################################
# Step-1 : Connect to file (open function)
#-------------------------------
F2 = open("out1.txt","r")
print("Connected to out1.txt")

# Step-2 : Read File (Many Ways)
#-------------------------------
# 1-way
file_content = F2.read() # This will read complete file content and return the string
print("file_content using read : ",file_content)
print("file_content using read - raw: ",repr(file_content))

F2.seek(0)

file_content = F2.read() # This will read complete file content and return the string
print("file_content 2nd time using read : ",file_content)
print("file_content 2nd time using read - raw: ",repr(file_content))

print("-"*40)
#--------------------------------
print("Read using Readline")
print("-"*40)
#--------------------------------
# File operations : will make use of pointer called seek pointer.
# when we open in read/write mode then seek pointer will be at 0th char(beginning of file)
# when we open in append ('a') mode then seek pointer will be at the end of file

# In above case. first time when used read() method, it read complete file contentn
# and seek reached end of the file, second time whenever we are reading, we will
# get empty bcoz seek reached end of file

# we can set seek to any char like seek(0) --> 0th char, seek(1) 1st char

# 2nd-way
F2.seek(0)
file_content = F2.readline() # Seek will move by one line
print("file_content using readline : ",file_content)

file_content = F2.readline() # Seek will move by one line
print("file_content using readline : ",file_content)
file_content = F2.readline() # Seek will move by one line
print("file_content using readline : ",file_content)
file_content = F2.readline() # Seek will move by one line
print("file_content using readline : ",file_content)
print("-"*40)
#--------------------------------

print("Read using while loop")
print("-"*40)
#--------------------------------
F2.seek(0)
while True:
    my_line = F2.readline()
    if my_line == '': # 'Empty quote represents, end of file
        break
    else:
        print(my_line)

print("-"*40)
#--------------------------------

print("Read using for loop")
print("-"*40)
#--------------------------------
F2.seek(0)

for my_line in F2:
    print(my_line)

print("-"*40)
#--------------------------------

print("Read using 'readlines' ")
print("-"*40)
#--------------------------------
F2.seek(0)

file_content = F2.readlines()
print(file_content)


print("-"*40)
#--------------------------------

print("Read using list/tuple/set/dict classes ")
print("-"*40)
#--------------------------------
F2.seek(0)
L = list(F2)
print("list L : ",L)

F2.seek(0)
T = tuple(F2)
print("tuple T : ",T)

F2.seek(0)
S = set(F2)
print("Set S : ",S)

"""
>>> 
>>> file_content = [10,"Python"]
>>> x = [(0,10) , (1,"Python")]
>>> dict(x)
{0: 10, 1: 'Python'}
>>> 
>>> # OR use enumerate function to produce pair
>>> e = enumerate(file_content)
>>> list(e)
[(0, 10), (1, 'Python')]
>>> dict(enumerate(file_content))
{0: 10, 1: 'Python'}
>>> 
"""

F2.seek(0)
D = dict(enumerate(F2))
print("Dict D : ",D)

print("-"*40)
#--------------------------------

# Step-3 : Disconnect (close function)
#-------------------------------
F2.close()
print("Conncetion with out1.txt closed")

# "w" -> Write only mode # Always empty file will be created
# "r" -> Read only mode # if file present  then we can read else FILE WILL NOT CREATED
# "a" -> Append Mode # if file present use it else create new one

# "w+" -> Read/Write only mode # Always empty file will be created
# "r+" -> Read/Write only mode # if file present  then we can read else FILE WILL NOT CREATED
# "a+" -> Append/Read Mode # if file present use it else create new one

