"""
Till Day-2 Summary
"""
print("Core Data Types")
print("Numbers")
a = 10
b = int(20)
print(a,b)

print("-"*40)

print("Strings")
c = "Python"
d = str("Python")
print(c,d)
print("Methods inside str class")
print(dir(c))

print("-"*40)

print("List")
L1 = [10,20,30]
L2 = list([10,20,30])
print(L1,L2)
print("Methods inside list class")
print(dir(L1))

print("-"*40)

print("Tuple")
T1 = (10,20,30)
T2 = tuple((10,20,30))
print(T1,T2)
print("Methods inside the tuple class")
print(dir(T1))

print("-"*40)

print("Dict class")
D1 = {"A" : 10, "B" : 20}
D2 = dict({"A" : 10, "B" : 20})
print(D1,D2)
print("Methods inside dict class")
print(dir(D1))

print("-"*40)

print("Set class")
S1 = {10,10,10,20,30}
S2 = set({10,10,10,20,30})
print(S1,S2)
print("Methods inside set class")
print(dir(S1))

print("-"*40)

print("frozenset class")
S1 = frozenset({10,10,10,20,30})
print(S1)
print("Methods inside frozenset class")
print(dir(S1))

print("-"*40)

print("if-conditional stmt")
x = 10
if x == 10:
    pass # Since we dont have {}, To keep any block empty
if x == 10:
    print("x is 10")

# if
# if-elif
#if-elif-else
#if-else

print("-"*40)

print("for loop")
# iterate over any collection
s = "Python"
for i in s:
    print("In for : ",i)

# break
# continue - goto next iteration

print("-"*40)

print("While loop")
x = 0
while x < 10:
    print("x in while : ",x)

# break
# continue

print("-"*40)

print("File operations")
# From program, connecting/interacting with external file
# text file with any extension like .txt, .csv, .mylog, .youlog

# 3 steps
# Step-1 : connect (open func)
# Step-2 : Do RW (Many ways)
# Step-3 : Disconnect (close)

print("-"*40)


