"""
Below string is having multiple lines in a single string. seperate each line and
extract
IP
DATE
PICS
URL
from each line(ip address line)
"""

in_string='''
fcrawler.looksmart.com - - [26/Apr/2000:00:00:12 -0400] "GET /contacts.html HTTP/1.0" 200 4595 "-" "FAST-WebCrawler/2.1-pre2 (ashen@looksmart.net)"
fcrawler.looksmart.com - - [26/Apr/2000:00:17:19 -0400] "GET /news/news.html HTTP/1.0" 200 16716 "-" "FAST-WebCrawler/2.1-pre2 (ashen@looksmart.net)"

ppp931.on.bellglobal.com - - [26/Apr/2000:00:16:12 -0400] "GET /download/windows/asctab31.zip HTTP/1.0" 200 1540096 "http://www.htmlgoodies.com/downloads/freeware/webdevelopment/15.html" "Mozilla/4.7 [en]C-SYMPA  (Win95; U)"

123.123.123.123 - - [26/Apr/2000:00:23:48 -0400] "GET /pics/wpaper.gif HTTP/1.0" 200 6248 "http://www.jafsoft.com/asctortf/" "Mozilla/4.05 (Macintosh; I; PPC)"
123.123.123.123 - - [26/Apr/2000:00:23:47 -0400] "GET /asctortf/ HTTP/1.0" 200 8130 "http://search.netscape.com/Computers/Data_Formats/Document/Text/RTF" "Mozilla/4.05 (Macintosh; I; PPC)"
123.123.123.123 - - [26/Apr/2000:00:23:48 -0400] "GET /pics/5star2000.gif HTTP/1.0" 200 4005 "http://www.jafsoft.com/asctortf/" "Mozilla/4.05 (Macintosh; I; PPC)"
123.123.123.123 - - [26/Apr/2000:00:23:50 -0400] "GET /pics/5star.gif HTTP/1.0" 200 1031 "http://www.jafsoft.com/asctortf/" "Mozilla/4.05 (Macintosh; I; PPC)"
123.123.123.123 - - [26/Apr/2000:00:23:51 -0400] "GET /pics/a2hlogo.jpg HTTP/1.0" 200 4282 "http://www.jafsoft.com/asctortf/" "Mozilla/4.05 (Macintosh; I; PPC)"
123.123.123.123 - - [26/Apr/2000:00:23:51 -0400] "GET /cgi-bin/newcount?jafsof3&width=4&font=digital&noshow HTTP/1.0" 200 36 "http://www.jafsoft.com/asctortf/" "Mozilla/4.05 (Macintosh; I; PPC)"
'''
#print(in_string)
print(repr(in_string)) # raw display of string

# Step-1 : Obtain list of lines
list_of_lines = in_string.split("\n")
print(list_of_lines)
print("-"*40)
#-----------------------------
for i in list_of_lines:
    print("i : ",i)

print("-"*40)
#-----------------------------
# Step-2 : Using 'for loop' process line by line
# Step-3 : if line is starting 3 digitis then extract the information

"""
>>> i = "123.123.123.123 - - [26/Apr/2000:00:23:48 -0400] "
>>> i[:3]
'123'
>>> i[:3].isdigit()
True
"""
for i in list_of_lines:
    if i[:3].isdigit():
        # The below code is copied from 8_program.py
        sp = i.split()
        ip = sp[0]

        dt = sp[3]
        dt = dt[1:dt.index(":")]

        pic = sp[6]
        pic = pic[pic.rindex("/") + 1:]

        url = sp[10]
        url = url.strip('"')

        print(ip,dt,pic,url)




