# Project Methodology

This section will mainly talk the file structures and the general methodology I took for this project.  

## File structure
First I would like to explain the structure used for the server.
The server has a file structure like:  
```bash
src/
├── app.js
├── controllers
│   ├── accountController.js
│   ├── apis
│   │   └── ...
│   ├── errorController.js
│   ├── homeController.js
│   ├── index.js
│   ├── searchController.js
│   └── userController.js
├── db
│   ├── assignmentDB.js
│   ├── index.js
│   ├── likesDB.js
│   ├── listingsDB.js
│   ├── offersDB.js
│   └── usersDB.js
├── middlewares
│   ├── addResUser.js
│   ├── index.js
│   ├── pathAuth.js
│   └── userAuth.js
├── uploads
│   ├── avatarIcons
│   │   └── ...
│   └── listingPictures
│       └── ...
├── utils
│   ├── index.js
│   ├── jwtUtils.js
│   └── validationUtils.js
├── views
│   ├── layouts
│   └── pages
├── views
│   ├── layouts
│   │   └── main.hbs
│   └── pages
│       ├── account
│       │   ├── createaccount.hbs
│       │   ├── loginaccount.hbs
│       │   └── logoutaccount.hbs
│       ├── error
│       │   └── 403.hbs
│       ├── home
│       │   └── homelandingpage.hbs
│       ├── search
│       │   └── searchpage.hbs
│       └── user
│           ├── listings
│           │   └── ...
│           ├── profile
│           │   └── ...
│           ├── userhome.hbs
│           └── viewuser.hbs
├── node_modules
│   └── ...
├── package.json
├── package-lock.json
├── sql_seed.sql
└── startup.sh.sample
```

Briefly, we have:
1. `controllers`
2. `db`
3. `middlewares`
4. `uploads`
5. `utils`
6. `views`

For these folders, with the exception of `views` and `uploads`, we will be exporting it as a module by only exporting the `index.js` in each of the folders.  
This way we do not have to individually import each file one by one.

### Controllers
Generally, we abstract this layer to only control the flow of actions to take based on the request made.  
As such actions such as calling a database or validation are abstracted away to other files and are not done directly here.

In this folder, we have the files that contain the respective endpoints they control.  
The files are divided into the controller files that are in the root folder such as `accountController.js` and files in the `api` folder.  
This distinction is to seperate the files handling general `GET request` for `html` pages from the files handling `api` requests.  

As such the files in the root folder are for handling html pages `GET request` and the files in the `api` are for handling api endpoints which return data.  

### Database (db)

Generally at this layer, we are abstracting it to only handle actions being done to our database. This includes the Create, Update, Read and Delete(CRUD) operations on the database. The database being used in this server is `MySQL`.

As such the files in this folder handle interactions with the `MySQL` server running on the same machine.  

The files are also seperated by what table they are generally interacting with. For example, `listingsDB.js` would contain any interactions that would involve the `LISTINGS` table.  

The config can be changed in the `index.js` file.  
**Note:** Some changes are made in the environment variables while others are made here.  

Config file shown below:  
```javascript
// db/index.js

// ...

// Setting up config and poolconnection
const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: process.env.MysqlUser,
    password: process.env.MysqlPassword,
    database: 'BED_CA1_Assignment',
    port: 3306
});

// ...

```

### Middlewares
The files in this folder deals with the custom middleware developed for the server.  
These middleware are applied server wide and as such apply to all incoming request.  

The middleware usage and order are as follows:  

1. `userAuth.js` &rarr; For verifying if the user is logged in based on their cookie `access_token` value.
2. `pathAuth.js` &rarr; Checking if the path the user is trying to go to is allowed for the user.
3. `addResUser.js` &rarr; If the user is logged in, add the user's details to the `req.user` and `res.locals.user`.

### Uploads
This folder mainly houses the locally stored files uploaded to the server.  
These usually are images for users profiles and listings.  
As their folder names may imply,  
`avatarIcons` &rarr; Stores any user's profile/avatar icons
`listingPictures` &rarr; Stores any listings pictures  

This folder is not really part of the server and really serves as a location to store incoming data files.

### Utils
The files in this folder are mainly misc things such as functions used to validate general incoming data and generating the `jwt` `access_tokens`.

### Views
This folder is also special as it houses the `html`/`hbs`(`handlebars`) files that will be rendered by the `handlebars-express` view engine.  
As such the file structure is to by how the user may interact with the pages.  

1. `layouts` &rarr; Mainly layouts for `handlebars` view engine to use
2. `pages` &rarr; Where the pages being served to users are
   1. `account` &rarr; Contains pages pertaining to login, and creating a user account
   2. `error` &rarr; The error pages
   3. `home` &rarr; Contains the landing pages
   4. `search` &rarr; Contains the seach pages
   5. `user` &rarr; Contains pages the users can view if they are logged in 
      1. `listings` &rarr; Conatins pages that deal with listings, both owned by the user and not owned.
      2. `profile` &rarr; Contains pages that deal with a user profile.