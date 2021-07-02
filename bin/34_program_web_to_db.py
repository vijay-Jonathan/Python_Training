"""
Our requirement is :
--------------------------------
Read website data using url, extract ip, date, image, url using regular expression
and ouput send it to database
--------------------------------

How to write?
--------------------------------
Step-1 : Create database and database table
Step-2 : Read data from website
Step-3 : Extract using regex
Step-4 : Send extracted info to db
--------------------------------

Step-1 : Create database and database table
--------------------------------
- We need database server.
- We can use sqlite database which is already installed with python
--------------------------------

Connect to Any database
--------------------------------
Python Program          --CONNECT/COMMUNICATE-->            External Data Base

Python Program          --CONNECT/COMMUNICATE-->            External Data Base
                                   (Using Python Libraries)

Example :
Python Program          --COMMUNICATE(Using Library - Cx-Oracle)-->            Oracle Database
Python Program          --COMMUNICATE(Using Library - pymysql)-->              MySql Database
Python Program          --COMMUNICATE(Using Library - sqlite3)-->                Sqlite Database
--------------------------------

Step-1 : Create database and database table
--------------------------------
Python Program          --COMMUNICATE(Using Library - sqlite3)-->                Sqlite Database

We need
1) Sqlite database server (It is already installed)
2) sqlite3 library (This is also installed in Standard library)
--------------------------------
"""
# Any SQL databases like oracle, mysql etc, steps are same
# Step-1 : Create database and database table
import sqlite3
print("Connecting to database..")
con = sqlite3.connect("my_database.sqlite3")
print("Done")

# First we need to Install pymysql
# import pymysql
# con = pymysql.connect(user="",password="",host="",port="",db="my_database")

cur = con.cursor() # To Communicate with Database and our program

my_query = """
CREATE TABLE IF NOT EXISTS MY_LOG_DATA(
IP VARCHAR(100),
DATE VARCHAR(100),
PICS VARCHAR(100),
URL VARCHAR(100)
)
"""
cur.execute(my_query)

# Step-2 : Read data from website
import re # Regular expression library
print("Reading Data From Website..")
my_url = "https://www.jafsoft.com/searchengines/log_sample.html"
import urllib.request as u
F = u.urlopen(my_url)
# We can read using F.read() etc..
# In our case, we need to read line by line so, we are using for loop
print("Processing using regex..")
for each_line in F:
    # print(each_line)
    # each_line is bytes class object
    # We are converting into string class, becuase regex library expects string
    each_line = each_line.decode()
    # print(each_line)
    # Extrating data from websites called : Web scraping
    # In our case, we are extracting IP, DATE, PICS, URL.

    # We are using regex instead of str class method
    # str class methods are good if data is in format, like our previous
    # if data is not in format, (messed), then we need to use regular expression
    # regex gaves option to write pattern/match pattern/extract
    # m = re.match('Which Pattern?'    ,   'On Which String?')
    # m = re.match('Which Pattern?', each_line)

    # 123.123.123.123 - - [26/Apr/2000:00:23:48 -0400] "GET /pics/wpaper.gif HTTP/1.0" 200 6248 "<A HREF="http://www.jafsoft.com/asctortf/">http://www.jafsoft.com/asctortf/</A>" "Mozilla/4.05 (Macintosh; I; PPC)"
    #m = re.match(' Here, tell how complete IP address line looks like  ' , each_line)

    # Ip address line looks like 1 to 3 digits then DOT then 1 to 3 digits then DOT then
    # 1 to 3 digits then DOT 1 to 3 digits and some characters after that

    # Charater by character we need to tell in regex ex: how 1st char looks like, 2nd char looks like etc
    # 123.123.123.123 - - [26/Apr/2000:00:23:48 -0400] "GET /pics/wpaper.gif HTTP/1.0" 200 6248 "<A HREF="http://www.jafsoft.com/asctortf/">http://www.jafsoft.com/asctortf/</A>" "Mozilla/4.05 (Macintosh; I; PPC)"
    # 1st char looks like digit
    # m = re.match('(\d\d\d\.\d{3}[.]\d{1,3}\.[0-9]{3}).*(\d{2}/[a-zA-Z]{3}/\d{4}).*',each_line)
    m = re.match('(\d\d\d\.\d{3}[.]\d{1,3}\.[0-9]{3}).*(\d{2}/[a-zA-Z]{3}/\d{4}).*GET\s+/(pics/([a-z0-9]+\.(gif|jpg)))?.*(http://\S+)</A>.*', each_line)
    # if no match found then m is having None
    # If there is a match then m will be having complete line
    # But we dont want complete line
    # We need to extract ip only
    # match, dont know about, waht we want like IP
    # so, match tells us that, which we want to capture, that portion
    # put a paranthesis, match will capture the content inside parenthesis
    # each catpure we called as group, and a number assigned to each group
    # starting from 1
    # In our case ip address group is one

    # (gif|jpg) : Even though we put bracket for OR condition, But Match also capture
    # this group as well

    # (pics/[a-z0-9]+\.(gif|jpg))? : /pics/image is may be there may not be there.
    # If it is there then match will capture this else this group will be having None

    # group(3) is "pics/imagename"
    # group(4) is "jpg/gif"
    # group(3) will come with 'pics' word, but we want only image name,
    # so we are making one more group
    # "pics/(imagename)"

    # .*http --> .* will match till 1st http or 2nd http?
    # answer : 2nd http, * will always occupy more --> called greedy operator
    # We can also tell occupy less (non-greedy) using *?

    if m != None: # Then there is a match in that line
        ip = m.group(1) # take group(1) data
        print(ip)
        dt = m.group(2)
        print(dt)
        pic = m.group(4)
        if pic == None:
            pic = "No Image"
        print(pic)
        url = m.group(6)
        print(url)
        my_query = f"INSERT INTO MY_LOG_DATA VALUES('{ip}','{dt}','{pic}','{url}')"
        print("Executing query : ",my_query)
        cur.execute(my_query)
con.commit() # Save to DB
print("All data processed successfully and inserted into database")
print("Please check the database.")



# COMMENTS
#### IDENTIFIERS
# \d -> any ONE digit b/n 0-9
# \D -> any ONE non-digit. expect 0-9
# . --> any ONE any character
#\. --> Strictly DOT
#[.] --> Strictly DOT
# \d{3} -> Internally it will make \d\d\d
# \d{1,3} -> Internally it will make (\d|\d\d|\d\d\d) -> | --> OR
# [0-9] --> \d --> any ONE digit b/n 0-9
# [0-5] --> any ONE digit b/n 0-5
# [0-9]{3} -->  internally it will make [0-9][0-9][0-9]
# \s -> Space
# \S -> non-space
# \s+ --> one or more space

# Modifiers
# * --> modify left side identifier to 0 or more times based on the input string
# .* --> Modify . to 0 or more times.if input string has 100 chars then * will produce 100 dots
#\d* --> modify \d to 0 or more times
# + --> Minimum 1 or more times
# ? --> 0 or 1 time

#################Comments-2
# if no match found then m is having None
# If there is a match then m will be having complete line
# But we dont want complete line
# We need to extract ip only
# match, dont know about, waht we want like IP
# so, match tells us that, which we want to capture, that portion
# put a paranthesis, match will capture the content inside parenthesis
# each catpure we called as group, and a number assigned to each group
# starting from 1
# In our case ip address group is one

# (gif|jpg) : Even though we put bracket for OR condition, But Match also capture
# this group as well

# (pics/[a-z0-9]+\.(gif|jpg))? : /pics/image is may be there may not be there.
# If it is there then match will capture this else this group will be having None

# group(3) is "pics/imagename"
# group(4) is "jpg/gif"
# group(3) will come with 'pics' word, but we want only image name,
# so we are making one more group
# "pics/(imagename)"

# .*http --> .* will match till 1st http or 2nd http?
# answer : 2nd http, * will always occupy more --> called greedy operator
# We can also tell occupy less (non-greedy) using *?
