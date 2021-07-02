"""
Read from server_log.txt
Extract
IP
DATE
PICS
URL
and
write to .txt and .csv file
"""

# Step-1 Connect to files
print("Connecting to log file..")
log_file = open(r"C:\Python_Training\log\server_log.txt" , "r")
print("Done")

print("Creating output files 'txt_report.txt' and 'csv_report.csv'")
txt_report_file = open("txt_report.txt","w")
csv_report_file = open("csv_report.csv","w")
print("Done")

print("Writing header to output file")
# Add heading line to both the reports
# write/writelines/print to write
# let me try, all 3 writes
txt_report_file.write("IP\tDATE\tPICS\tURL\n")
csv_report_file.writelines([  "IP,"  ,  "DATE,"  ,  "PICS,"  ,  "URL\n"  ])
print("Done")

print("Processing log file..")
# Below code is copied from 18th program
for i in log_file:
    if i[:3].isdigit():
        sp = i.split()
        ip = sp[0]

        dt = sp[3]
        dt = dt[1:dt.index(":")]

        pic = sp[6]
        pic = pic[pic.rindex("/") + 1:]

        url = sp[10]
        url = url.strip('"')

        print(ip,dt,pic,url,sep="\t",file=txt_report_file)
        print(ip, dt, pic, url, sep=",", file=csv_report_file)

print("Closing all file connections...")
# Step-3 Disconnect
log_file.close() # close will flush and close
txt_report_file.close()
csv_report_file.close()
print("Done")
print("Processing Completed.")
print("Please check log file 'txt_report_file' and 'csv_report_file' ")
