"""
If we make 22nd log processing example to function,
we can use same function to process different log files

Finally,
write a function to take filename/path as an argument, extract all info like
IP
DATE
IMAGE
URL
and return list of tuples. where each tuple will be having one line details
Ex: [ (''123.123.123.123',dt,pics,url) , (ip,dt,pics,url), (ip,dt,pics,url)]

"""
# Log [processing code is copied from 22nd example

# 1-way to define
# def my_log_proc_function(file_path):
# While calling just filepath we need to pass

# 2-way
# def my_log_proc_function(*,file_path):
# while calling we need to pass file_path="path" format
# Advantage is, it looks user friendly like print function where we used sep="", file="", end="" etc

def my_log_proc_function(*,file_path): # file_path is keyword only argument, mention arg name while calling this function
    print("Connecting to log file..")
    log_file = open(file_path, "r")
    print("Done")

    print("Processing log file..")
    final_result = []
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
            each_line_tuple = (ip,dt,pic,url)
            final_result.append(each_line_tuple)
    return final_result


received_data = my_log_proc_function(file_path=r"C:\Python_Training\log\server_log.txt")
print("received_data : ",received_data)
