"""
Read database and write result into files
Using pandas library

About Pandas library:
- it is having 2 main classes
1) Series class   -- Inside Series class, there are methods reltead to 1 dimentional data
2) DataFrame class - Inside DataFrame classs, we have methods related 2 dimensional data like excel,csv

We alread have list, tuple etc then why DataFrame??
Because Inside DataFrame class there HUGE number of methods available

"""

L1 = list([[10,20,30],[40,50,60]])
L2 = [[10,20,30],[40,50,60]]
print("Lists are :",L1, L2)

import pandas as pd
df = pd.DataFrame([[10,20,30],[40,50,60]])
print("df : ")
print(df)

print("-"*40)

print("Methods inside DataFrame Class")
print(dir(df))

print("-"*40)

df2 = pd.DataFrame([[10,20,30],[40,50,60]],index=["myrow-1" , "myrow-2"], columns=["mycol-1","mycol-2","mycol-3"] )
print("df2 : ")
print(df2)

print("-"*40)

print("Reading SQL DB data & creating DataFrame")
# Why we are creating DataFrame class object?
# Because we can make use of the methods inside DataFrame class

import sqlite3
print("Connecting to database..")
con = sqlite3.connect("my_database.sqlite3")
print("Done")

print("Executing select query..")
cur = con.cursor() # To Communicate with Database and our program
my_query = "SELECT * FROM MY_LOG_DATA"
cur.execute(my_query)
print("Done")

print("Creating DataFrame from db data")
# db_result = cur.fetchall()
# my_db_df = pd.DataFrame(db_result)

my_db_df = pd.DataFrame(cur,columns=["IP","DATE","PICS","URL"]) # DataFrame internally call cur.fetchall() to get the data
print("Done")
print(my_db_df)

print("-"*40)

print("Writing to csv file..")
my_db_df.to_csv("db_dump_3.csv")
print("csv file created successfully, please check db_dump_3.csv file")

print("writing excel file..")
my_db_df.to_excel("db_dump_4.xlsx")
print("xlsx file created successfully, please check db_dump_4.xlsx file")

print("writing json file..")
my_db_df.to_json("db_dump_5.json")
print("json file created successfully, please check db_dump_5.json file")

print("-"*40)

print("Top 3 rows")
print(my_db_df.head(3))

print("-"*40)

print("Bottom 3 rows")
print(my_db_df.tail(3))

print("-"*40)

print("IP column")
print(my_db_df["IP"])

print("-"*40)

print("Accessing using Index")
print("One Cell : ")
#print(my_db_df.iloc[ row , column ])
print(my_db_df.iloc[ 1 , 1 ]) # 1st row & 1st column (index starts from 0)

print("-"*40)

print("One row : ")
print(my_db_df.iloc[ 1  ]) # 1st row

print("-"*40)

print("One column : ")
print(my_db_df.iloc[ : , 1]) # 1st column

print("-"*40)

print("Few Rows :  rows 1 to 5 ")
print(my_db_df.iloc[ 1 : 5 ]) # Row index 1,2,3,4

print("-"*40)

print("Few columns : columns 1 to 3")
print(my_db_df.iloc[ : , 1:3]) # Column index 1,2 will come

print("-"*40)

print("Using maths : count of IP columns")
print(my_db_df["IP"].count())

print("-"*40)

print("Get Value counts of pics column")

pics_val_count_df = my_db_df["PICS"].value_counts()
print(pics_val_count_df)

print("-"*40)
"""
Get Value counts of pics column
No Image         2
5star.gif        1
5star2000.gif    1
a2hlogo.jpg      1
wpaper.gif       1
"""

print("Plotting graph on value count")
import matplotlib.pyplot as plt

pics_val_count_df.plot()
plt.show()

pics_val_count_df.plot.bar()
plt.savefig("mygraph.png")
print("Graph saved successfully, please check mygraph.png")
print("-"*40)

# python --output--> console
# Python --> External files
# Python --> website
# Python --> Databases
# Python --> External files and plots

print("Write pics Value count to one sheet of excel, graph to another sheet")

# To interact with multiple sheets in excel workbook then use ExcelWriter class
print("Creating object of ExcelWriter Class")
my_writer = pd.ExcelWriter("myreport.xlsx",engine="xlsxwriter")
print("Done")

print("Methods inside ExcelWriter Class")
print(dir(my_writer))

print("Send value count data to default sheet excel file")
pics_val_count_df.to_excel(my_writer,sheet_name="ValueCount")

# To insert graph

# Step-1 : Obtain reference to Workbook
wb = my_writer.book

# Step-2 : add new sheet
ws = wb.add_worksheet("MyGraph")

# Step-3 : Insert image to sheet2
ws.insert_image("B2","mygraph.png") # Column-B, row-2

# Step-4: Save
my_writer.close()
print("Report generated successfully. Please check myreport.xlsx ")

