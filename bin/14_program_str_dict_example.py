"""
8_program_str_example.py
display output in dictionary
"""
in_string = '123.123.123.123 - - [26/Apr/2000:00:23:48 -0400] "GET /pics/wpaper.gif HTTP/1.0" 200 6248 "http://www.jafsoft.com/asctortf/" "Mozilla/4.05 (Macintosh; I; PPC)"'

my_data = {} # EMPTY Dictionary

sp = in_string.split()
ip = sp[0]
my_data["IP"] = ip

dt = sp[3]
dt = dt[1:dt.index(":")]
my_data["DATE"] = dt

pic = sp[6]
pic = pic[ pic.rindex("/")+1 : ]
my_data["PICS"]=pic

url=sp[10]
url = url.strip('"')
my_data["URL"] = url

print(my_data)
