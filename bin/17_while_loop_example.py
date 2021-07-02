"""
While loop
- based on the condition, if we want to execute the loop
- Manually we can set the condition
"""
print("While with numbers")
print("-"*40)
#--------------------------
a = 0

while a < 10:
    print("a : ",a)
    a = a + 1
print("Other statements")

print("-"*40)
#--------------------------

# Iterate even collections
L = [10,20,30]
i = 0
while i < len(L):
    print("Element : ",L[i])
    i += 1

print("-"*40)
#--------------------------

print("Using break statement")
print("-"*40)
#---------------------

my_companies = ["IBM" , "Sling India", "SAP" , "Sling US"]

i = 0
while i < len(my_companies):
    if my_companies[i].startswith("Sling"):
        print("Found")
        break
    i = i + 1

print("-"*40)
#---------------------

print("With continue statement")
print("-"*40)
#---------------------
my_companies = ["IBM" , "Sling India", "SAP" , "Sling US"]

i = 0
while i < len(my_companies):
    if not my_companies[i].startswith("Sling"):
        i += 1
        continue # Skip current iteration and goto next iteration (Start from for begining)
    # The below statement are related to sling company
    print("Company name is : ",my_companies[i])
    print("sling is having head quarters in US")
    print("sling is having offices in some locations")
    print("sling is having xyz employess")
    i +=1

print("-"*40)
#---------------------

# We dont have do-while keyword, but we can achieve in other way

print("Alternate to Do-While")
print("-"*40)
#---------------------
"""
Other language
do{

}while()
"""

# do ---> while True:
# check condition using if statement then break,

# Below code combines, do-while, input function as well
my_cart = []
while True:
    item = input("Enter Item : ")
    my_cart.append(item)
    ch = input("Do you want to quit(yes/no)?")
    ch = ch.lower()
    if ch == "yes":
        print("my_cart : ",my_cart)
        break

print("-"*40)
#---------------------