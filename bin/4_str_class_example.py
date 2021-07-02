"""
In this section, we are discussing about
Core Data Types, That too
2. str class
"""
a = 'WEL COME' # Internally it calls str('WEL COME')
b = "WEL COME" #Internally it calls str("WEL COME")
c = '''WEL COME''' # Internally it calls str('''WEL COME''')
d = """WEL COME""" # Internally it calls str("""WEL COME""")

e = str('WEL COME')
f = str("WEL COME")
g = str('''WEL COME''')
h = str("""WEL COME""")

print("Strings are : ",a,b,c,d,e,f,g,h,sep="\n")
print("-------------------------------------")

print("Indexes : Accessing each character")
print("-------------------------------------")
# sOME PROJECTS, WE may need to access individual characters
i = 'WEL COME'
print("Char at index 0 ",i[0])
print("Char at index 1 ",i[1])
print("Char at index 2 ",i[2])
print("Char at index 3 ",i[3])
print("Char at index 4 ",i[4])
print("Char at index 5 ",i[5])
print("Char at index 6 ",i[6])
print("Char at index 7 ",i[7])
#print("Char at index 8 ",i[8]) # THIS WILL THROW INDEX ERROR
print("-------------------------------------")

print("Substring")
print("-------------------------------------")

print("Substring 1 to 6 : ",i[1:6]) # Expected EL COM but it will dispaly EL CO--> In slicing, start index is included and end index is excluded
print("Substring 1 to END : ",i[1:]) # No end index means, till end
print("Substring BEGGINNING to 6 : ",i[:6]) # No Start index means, from beginning
print("Substring BEGINNING to END : ",i[ : ]) # No Start, No End index means, Beginning to end

print("-------------------------------------")
print("-------------------------------------")

print("Substring with step value")
print("-------------------------------------")
print("Substring 1 to 6 Default step is 1 : ",i[1:6]) # Give me every character from 1 to 6 
print("Substring 1 to 6 step is 1 : ",i[1:6:1]) # Give me every character from 1 to 6
print("Substring 1 to 6 step is 2 : ",i[1:6:2]) # Give me every 2nd character from 1 to 6
# i[1:6] :EL CO
# i[1:6:2] : E O
print("Substring 1 to 6 step is 3 : ",i[1:6:3]) # Give me every 3rd character from 1 to 6
# i[1:6] :EL CO
# i[1:6:3] : EC
print("-------------------------------------")

print("Traverse Reverse")
print("-------------------------------------")
print("Substring 1 to 6 step is 1 (Left-Right): ",i[1:6:1])
print("Substring 6 to 1 step is -1 (Right-Left): ",i[6:1:-1])
# i[6:1:-1] = Start index 6 is included and end index 1 is excluded
# i[6:1:-1] = MOC L

print("Substring 1 to 6 step is 2 (Left-Right): ",i[1:6:2])
print("Substring 6 to 1 step is -2 (Right-Left): ",i[6:1:-2])
# 6 to 1 : MOC L
# i[6:1:-2] # MCL

print("Substring 1 to 6 step is 3 (Left-Right): ",i[1:6:3])
print("Substring 6 to 1 step is -3 (Right-Left): ",i[6:1:-3])
# 6 to 1 : MOC L
# i[6:1:-3] = M (M then ONE SPACE will come)
print("-------------------------------------")

print("NEGATIVE Indexes : Accessing each character")
print("-------------------------------------")
# sOME PROJECTS, WE may need to access individual characters
i = 'WEL COME'
print("Char at index -8 ",i[-8])
print("Char at index -7 ",i[-7])
print("Char at index -6 ",i[-6])
print("Char at index -5 ",i[-5])
print("Char at index -4 ",i[-4])
print("Char at index -3 ",i[-3])
print("Char at index -2 ",i[-2])
print("Char at index -1 ",i[-1])
#print("Char at index 8 ",i[8]) # THIS WILL THROW INDEX ERROR
print("-------------------------------------")

print("Substring Using Neagtive INDEX")
print("-------------------------------------")

print("Substring 1 to 6 : ",i[-7:-2]) # Expected EL COM but it will dispaly EL CO--> In slicing, start index is included and end index is excluded
print("Substring 1 to END : ",i[-7:]) # No end index means, till end
print("Substring BEGGINNING to 6 : ",i[:-2]) # No Start index means, from beginning
print("Substring BEGINNING to END : ",i[ : ]) # No Start, No End index means, Beginning to end

print("-------------------------------------")

# 0	1	2	3	4	5	6	7
# W	E	L		C	O	M	E
# -8	-7	-6	-5	-4	-3	-2	-1

print("Substring with step value Using NEGATIVE INDEXS")
print("-------------------------------------")
print("Substring 1 to 6 Default step is 1 : ",i[-7:-2]) # Give me every character from 1 to 6 
print("Substring 1 to 6 step is 1 : ",i[-7:-2:1]) # Give me every character from 1 to 6
print("Substring 1 to 6 step is 2 : ",i[-7:-2:2]) # Give me every 2nd character from 1 to 6
# i[1:6] :EL CO
# i[1:6:2] : E O
print("Substring 1 to 6 step is 3 : ",i[-7:-2:3]) # Give me every 3rd character from 1 to 6
# i[1:6] :EL CO
# i[1:6:3] : EC
print("-------------------------------------")


print("Traverse Reverse Usign NEGATIVE INDEXES")
print("-------------------------------------")
print("Substring 1 to 6 step is 1 (Left-Right): ",i[-7:-2:1])
print("Substring 6 to 1 step is -1 (Right-Left): ",i[-7:-2:-1])
# i[6:1:-1] = Start index 6 is included and end index 1 is excluded
# i[6:1:-1] = MOC L

print("Substring 1 to 6 step is 2 (Left-Right): ",i[-7:-2:2])
print("Substring 6 to 1 step is -2 (Right-Left): ",i[-7:-2:-2])
# 6 to 1 : MOC L
# i[6:1:-2] # MCL

print("Substring 1 to 6 step is 3 (Left-Right): ",i[-7:-2:3])
print("Substring 6 to 1 step is -3 (Right-Left): ",i[-7:-2:-3])
# 6 to 1 : MOC L
# i[6:1:-3] = M (M then ONE SPACE will come)
print("-------------------------------------")

print("String concatination and Repetation")
print("-------------------------------------")
s1 = "Hello"
s2 = "Python"
result1 = s1 + s2 # concatinate
result2 = s1 * 10 # repeat 'Python' 10 times
print(result1,result2,sep="\n")

my_line = "-"*40 # Repeate string "-" 40 times
print(my_line)
#######################

my_file_path1 = "C:\newfolder\test.py" # Here, \n will be replaced with newline and \t will be replaced with tab space
print("my_file_path1 : ",my_file_path1)

print("my_file_path1 in raw format : ",repr(my_file_path1)) # Internally \n\t got replaced with newline and tab space and storeed in my_file_path1

my_file_path2 = r"C:\newfolder\test.py" # r--> raw string
print("my_file_path2 : ",my_file_path2)

print(my_line)
#######################

i = "WEL COME"
result = i.startswith("WEL")
print('i.startswith("WEL") : ',result)

result = i.endswith("WEL")
print('i.endswith("WEL") : ',result)

result = i.isupper()
print('i.isupper() : ',result)

result = i.islower()
print('i.islower() : ',result)

result = i.istitle() # Wel Come Python Programming
print('i.istitle() : ',result)

print(my_line)
#######################

result = i.lower() # Convert ot lowercase
print('i.lower() : ',result)

result = i.upper() # convert to upper case
print('i.upper() : ',result)

result = i.title() # convert to title case
print('i.title() : ',result)

j = "abc"
result = j.isalpha()
print('j.isalpha() : ',result)

k = "abc123"
result = k.isalnum()
print('k.isalnum() : ',result)


l = "123"
result = l.isdigit()
print('l.isdigit() : ',result)

k = "abc123"
# Take last 3 chars
m_1_way = k[3:]
m_2_way = k[-3:]
result = m_2_way.isdigit()
print('Last 3 characters are digit ? : ',result)

print(my_line)
#######################

i = "WEL COME"

result = i.index("E") # From left first E's index
print('i.index("E") : ',result)

result = i.index("E",3) # Start looking From 3rd index, first E's index
print('i.index("E",3) : ',result)

result = i.find("E") # From left first E's index
print('i.find("E") : ',result)

result = i.find("E",3) # Start looking From 3rd index, first E's index
print('i.find("E",3) : ',result)

# Difference between find and index
# result = i.index("X") # INDEX ERROR -- bcoz X is not present
# result = i.find("X") # returns -1.   -- bcoz X is not present

print(my_line)
#######################

j = "     wel      come      "
result = j.strip() # Removes extra spaces from beginning as well as end
print("j.strip() : ",result)

result = j.lstrip() # Removes extra spaces from beginning
print("j.lstrip() : ",result)

result = j.rstrip() # # Removes extra spaces from end
print("j.rstrip() : ",result)


j = "wel come"

result = j.strip("ew") # 
print("j.strip() : ",result) # "l com"

result = j.lstrip("ew") 
print("j.lstrip('ew') : ",result) # "l come"

result = j.rstrip("oe") 
print("j.rstrip('oe') : ",result) # "wel com"


print(my_line)
#######################

k = "WEL COME"
result = k.split() # make pieces based on space. Return list of pieces ["WEL","COME"]
print("k.split()",result)

result = k.split("E") # make pieces based on 'E' : ["W" , "L COM" , ""]
print("k.split('E')",result)

result = k.replace("WEL","wel")
print('replace("WEL","wel") : ',result)

result = k.count("E")
print('k.count("E") : ',result)

print(my_line)
#######################

m = "Wel Come"
print("Length of m : ",len(m))

x = 10
y = 20
z = x + y

result1 = "add of x and y is z" # x,y,z will not replaced with the values
result2 = f"add of {x} and {y} is {z}" # f--> format
print(result1,result2,sep="\n")

print(my_line)
#######################
