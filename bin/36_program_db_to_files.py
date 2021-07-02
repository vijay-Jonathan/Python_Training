"""
Program to read database and send data to files like csv, json, excel.
"""
import sqlite3
print("Connecting to database..")
con = sqlite3.connect("my_database.sqlite3")
print("Done")

cur = con.cursor() # To Communicate with Database and our program
my_query = "SELECT * FROM MY_LOG_DATA"
cur.execute(my_query)
db_result = cur.fetchall()
print("db_result : ")
print(db_result)
print("-"*40)

print("Writing DB result to file")
print("-"*40)

print("Creating 'db_dump_1.txt' and 'db_dump_2.csv'.. ")
F1 = open("db_dump_1.txt","w")
F2 = open("db_dump_2.csv","w")
print("Success")

print("Writing Header to both the files...")
#print("IP","DATE","PICS","URL",sep="\t",file=F1) # flush is optional becuase anyway we are closing, close will flush as well

L = ["IP","DATE","PICS","URL"]
#print(L)
#print( ["IP","DATE","PICS","URL"] )

#print(*L)
#print( "IP","DATE","PICS","URL" )

print(*L,sep="\t",file=F1)
print(*L,sep=",",file=F2)
print("Success")

print("Writing db_result to both the files..")
for my_each_row in db_result: # my_each_row("123.123.123.123","20/Jun/1991", "wpaper.gif","http://ndjsasd")
    print(*my_each_row, sep="\t",file=F1)
    print(*my_each_row, sep=",", file=F2)


print("Completed.")
print("Please check files 'db_dump_1.txt' and 'db_dump_2.csv' ")
print("Disconnected the files..")
F1.close()
F2.close()
print("Success")