# How to set up the server  

## 1. Getting the files needed  
```bash
# First we clone the repo from github
git clone https://github.com/chuanhao01/Full_Stack_Web_App.git
# Then we need to cd into the project and install the required node modules
cd Full_Stack_Web_App
npm i
```  

## 2. Setting up the enviroment  
Here we need to set up the MySQL database in order for the server to run.  
To do this, we load the `sql_seed.sql` file into MySQL to create the database and run the sql file.

## 3. Running the server
Now we should be able to start the server with
```bash
node app.js
```