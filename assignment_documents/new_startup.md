# How to setup up the server

### 1. Getting the source files
```bash
# First we clone the repo from github
git clone https://github.com/chuanhao01/Full_Stack_Web_App.git
```
**Note:** Downloads from the zip file look below
```bash
#  In this case, we would already have the base files and folder
# It should look somthing like this
/Full_Stack_Web_App
├── assignment_documents
│   └── ...
├── README.md
└── src
    └── ...
```
Now depending on your Operating System read the steps below carefully  
```bash
# cd into the dir and checkout the corrospoding barnch
cd Full_Stack_Web_App
# For ubuntu distros
git checkout develop
# For windows distros
git checkout windows_release
# cd into the src folder which has the server
cd src
```  
### 2. Setting up other dependicies  
**Note:** Make sure you have `MySQL` server installed for your respective distro.   
Now you have 2 options.  
Option 1:  
Use MySQL workbench to load and run the `sql_seed.sql` file in the workbench.  
Option 2:  
You can use the `mysql-shell` to run the sql file.  
```bash
# To enter the mysql shell either
sudo mysql
# Or
mysql -u root -p YOUR_ROOT_PASSWORD_HERE
# Then to run the script
source path_to_sql_seed_file_from_root/
# etc. source /home/username/Full_Stack_Web_App/src/sql_seed.sql
```

Once you have loaded sql file either through the workbench or shell, move on to the following.  

Now make sure the user that is going to be accessing the `MySQL` database has access to it.  
```bash
# Either use this command in the workbench for non-root users
GRANT ALL PRIVILEGES ON `BED_CA1_Assignment`.* TO "user_username"@"localhost";
# Or this if you are the root user
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'YOUR_ROOT_PASSWORD_HERE'
```

After setting up the `MySQL` server, we can start setting up the config files.  

#### Ubuntu/Linux distros

Make sure you are on the `develop` branch for this.  
As this is on ubuntu/linux, we will be using bash environment variables.  
Using the `startup.sh.sample` as an example, change the contents in the file.  
```bash
# Make a compy of the sample file
cp startup.sh.sample startup.sh
# Then change the file using a text editor
vim startup.sh
# Change the strings for your own setup
#! startup.sh.sample/startup.sh
export MysqlUser='Your MySQL username GOES HERE';
export MysqlPassword='Your MySQL password GOES HERE';
export JWT_SECRET='Your JWT SECRET GOES HERE';
export COOKIE_SECRET='Your COOKIE SECRET GOES HERE';
```
Then to load the enviroment variables into the bash enviroment using:  
```bash
# Make sure you are currently in the src directory
# Change the file to be executable and then run it.
sudo chmod 771 startup.sh
. startup.sh
```

#### Windows distros  

Make sure you are on the windows_release.  
As this is on windows, we will be using the `dotenv` and `bcryptjs` node libraries instead of bash environment variables and the corrospoding `bcrypt` library.  
Using the `.env.sample` as an example, change the contents of the file,  
```bash
# Make a copy of the samepl file
cp .env.sample .env
# Edit the file in a text editor
vim .env
# Change the strings for your own setup
#! startup.sh.sample/startup.sh
MysqlUser=YOUR_MySQL_username_here
MysqlPassword=YOUR_MySQL_password_here
JWT_SECRET=YOUR_jwt_secret_here
COOKIE_SECRET=YOUR_cookie_secret_here
```

#### Installing the correct `node_modules`  
**Note:** Make sure you have `nodejs` and `npm`(node pacakge manager) installed before hand.  
You can run,  
```bash
# To check for node
node --version
# To check for npm
npm --version
```
Now in the `src` dir, to install all to required node_modules, run, 
```bash
npm i
```

### 3. Running the server  
Once everything is configured, you can run the server using,  
```bash
# Using node to run the server
node app.js
# Using nodemon to run the server
npm start
```
