"""
Write a program to extract
IP
Date
PICS
URL
from the string given below

123.123.123.123 - - [26/Apr/2000:00:23:48 -0400] "GET /pics/wpaper.gif HTTP/1.0" 200 6248 "http://www.jafsoft.com/asctortf/" "Mozilla/4.05 (Macintosh; I; PPC)"

"""

in_string = '123.123.123.123 - - [26/Apr/2000:00:23:48 -0400] "GET /pics/wpaper.gif HTTP/1.0" 200 6248 "http://www.jafsoft.com/asctortf/" "Mozilla/4.05 (Macintosh; I; PPC)"'
sp = in_string.split()
ip = sp[0]

dt = sp[3]
dt = dt[1:dt.index(":")]

pic = sp[6]
pic = pic[ pic.rindex("/")+1 : ]

url=sp[10]
url = url.strip('"')

print(ip,dt,pic,url)

"""
>>> in_string = '123.123.123.123 - - [26/Apr/2000:00:23:48 -0400] "GET /pics/wpaper.gif HTTP/1.0" 200 6248 "http://www.jafsoft.com/asctortf/" "Mozilla/4.05 (Macintosh; I; PPC)"'
>>> 
>>> 
>>> sp = in_string.split()
>>> sp
['123.123.123.123', '-', '-', '[26/Apr/2000:00:23:48', '-0400]', '"GET', '/pics/wpaper.gif', 'HTTP/1.0"', '200', '6248', '"http://www.jafsoft.com/asctortf/"', '"Mozilla/4.05', '(Macintosh;', 'I;', 'PPC)"']
>>> ip = sp[0]
>>> ip
'123.123.123.123'
>>> dt = sp[3]
>>> dt
'[26/Apr/2000:00:23:48'
>>> #1-way
>>> dt[1:dt.index(":")]
'26/Apr/2000'
>>> 
>>> pic = sp[6]
>>> pic
'/pics/wpaper.gif'
>>> #1-way

>>> pic[ pic.rindex("/")+1 : ]
'wpaper.gif'
>>> 
>>> sp
['123.123.123.123', '-', '-', '[26/Apr/2000:00:23:48', '-0400]', '"GET', '/pics/wpaper.gif', 'HTTP/1.0"', '200', '6248', '"http://www.jafsoft.com/asctortf/"', '"Mozilla/4.05', '(Macintosh;', 'I;', 'PPC)"']
>>> url=sp[10]
>>> url
'"http://www.jafsoft.com/asctortf/"'
>>> print(url)
"http://www.jafsoft.com/asctortf/"
>>> url = url.strip('"')
>>> url
'http://www.jafsoft.com/asctortf/'
>>> print(url)
http://www.jafsoft.com/asctortf/
>>> 
"""
