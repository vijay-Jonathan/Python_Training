"""
- This init file will be automatically executed by import statement before import any modulein that package
- Example : import MyPackage.googlecloud.MyModule
    then import will execute init first then it will import MyModule.

- Why init file?
- before importing module, if we want to do some prerequisite tasks, then those
logic will be added in init file
- Example : file wall is enabled? port is open? antivirus not blocking, some libraries are installed.. etc..
- does not meet System requirements..

- if we have multiple import statements then init will execute one time only
"""
print("Inside Init")
