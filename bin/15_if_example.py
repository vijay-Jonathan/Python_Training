"""
Till now,
we wrote a program and when we execute, it was executing from top to bottom, all the lines

Now,
In some scenario, we may need to execute some statements/group of statements based on some conditions
In those cases, we can make use of conditional 'if' statement.

# In other language
    s0
if condn(){
                            s1
        s2
    s3
}
s4

# In python we wont use curly braces {}.
# Instead we NEATLY FORMAT the code by providing INDENTATION

s0 # OUTSIDE THE BLOCK
if condn():
    s1 # INSIDE THE BLOCK
    s2# INSIDE THE BLOCK
    s3# INSIDE THE BLOCK
s4 # OUTSIDE THE BLOCK

"""

x = 10
if x == 10:
    print("x is 10")
if x < 10 :
    print("x is less than 10")
if x > 10:
    print("x is greater than 10")

print("Other statements")

print("-"*40)
#-----------------------

print("Using if-elif block/chain")
print("-"*40)
#-----------------------
# In previous case, if one condition is true then also it is verifying other two conditions whoch are not required
# to avoid that, we can make use of if-elif chain

x = 10
if x == 10:
    print("x is 10")
elif x < 10 :
    print("x is less than 10")
elif x > 10:
    print("x is greater than 10")

print("Other statements")

print("-"*40)
#-----------------------

print("With Strings")
print("-"*40)
#-----------------------
s = "Python"
if not s.startswith("Java"):
    print("Not Java")
if s != "C++":
    print("Not C++")
if "th" in s:
    print("Substring th found")

print("-"*40)
#-----------------------

print("With list/tuple/set etc.. Any collection")
print("-"*40)
#-----------------------
L1 = [10,20,30]
L2 = L1
L3 = L1.copy()

if L1 is L2 : # id(L1) == id(L2) # This is for any reference not only collection
    print("Bot L1 & L2 refers same object")

if L1 == L3 :
    print("Contents are verified and Same")

if 20 in L1:
    print("20 found in L1")

print("-" * 40)
# -----------------------

print("With dictionary")
print("-"*40)
#-----------------------

D = {"A" : 10 , "B" : 20}

print("Only keys in D : ",D.keys()) # ["A" , "B"]
print("Only values in D : ",D.values()) # [10 , 20]
print("Both key/value in list of tuples in D : ",D.items()) # [("A" , 10) , ("B" , 20)]

if "A" in D: # OR if "A" in D.keys()
    print("Key A found")

if 20 in D.values():
    print("Value 20 found")

if ("A" , 10) in D.items():
    print("Item Found")

print("-"*40)
#-----------------------
