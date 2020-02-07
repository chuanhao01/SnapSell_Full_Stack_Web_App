# Updates from CA1

This markdown document will contain the changes I made from the CA1 assignment.  

**Note:** This document will only be referring to the server on the `master` branch, which is the 'main' server in this project.  

As for the other 'modified' servers, there will another document explaining them.

## Modifications  
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

### API reference

Here I will be listing out all the endpoints made and used in the server.  
Endpoints for loading the front-end html  

#### Landing page  
**GET /**   
Returns the home landing page of the server  

#### Login page  
**GET /login**   
The normal login page for the user  

#### Account creation page
**GET /account/create** 
The page for new users to create an account  

---
### Below are only accessable to users who are logged in.  
---
#### User's home page  
**GET /user/home**  
The logged in user's home page.  

#### User's profile page  
**GET /user/profile**   
The page for user's to view their own profile.  

####  User's profile edit page  
**GET /user/profile/edit**   
The page to allow users to edit their own profile.  

#### Viewing your own listings  
**GET /user/listing**  
The page to allow the user to look at his own listings  

#### View one of your own listings  
**GET /user/listing/{listing_id}**  
The page where you get to look more specifically at your own listing.

#### Add a listing  
**GET /user/listing/add**   
The page to add a listing  

#### Add a picture to your listing  
**GET /user/listing/picture/add/{listing_id}**  
The page to add more pictures to one your own specific listings  

#### Edit the pictures one of your listings has  
**GET /user/listing/picture/edit/{listing_id}**   
The page to edit the pictures your listings has.  

#### Edit one of your own listings  
**GET /user/listing/edit/{listing_id}**  
The page to edit one of your own listings  

#### Look at all other listings  
**GET /listings**  
The page where the user gets to select what listings he want to look at. Note he will not see any of his own listings  

#### Looking at a specific listing  
**GET /listing/{listing_id}**  
The page where the user can specifically look at listing he might want to place an offer on. Note, cannot be his own listings.  

#### Place an offer on a listing  
**GET /listing/offer/{listing_id}**   
The page for the user to add an offer to a listing.  

#### Edit an existing offer  
**GET /listing/offer/edit/{listing_id}**  
The page to edit an offer a user might already have on a listing.  

#### Searching for a listing or user  
**GET /search?**  
The page where the user can search for a listing or user.  

---  
From here on, we will be doing API endpoints, where it might recieve and respond with data, rather than html pages.  

The following do not require the user to be logged in.

#### Creating an account  
**POST /api/account**    
The endpoint to create an account.  
Responds with 201 for success.
| KEY | Type | Description |
| --- | ------ | ----------- |
| avatar_icon | image file | The avatar icon of the user |
| username | string | The username of the user |
| password | string | The password of the user in plain text |

#### Login to your account  
**POST /api/login**   
The api to send your login credentials to get your `access_token` and `refresh_token`.  
Responds with 200 for successful login.  
| KEY | Type | Description |
| --- | ------ | ----------- |
| username | string | The username of the user |
| password | string | The password of the user in plain text |

#### Generate another access_token based on your refresh_token  
**GET /api/refresh_token**   
200 success will have the new access_token  
| KEY | Type | Description |
| --- | ------ | ----------- |
| refresh_token | string | The jwt `refresh_token` given when you login |

---

The api endpoints below do require the user to be logged in.

---

### Listings

#### Get all of your own listings  
**GET /api/listing**   
Returns 200 with all of your listings if you are logged in.  

#### Add a listing  
**POST /api/listing**   
Status code 201 on success  
| KEY | Type | Description |
| --- | ------ | ----------- |
| title | string | Title of the listing |
| description | string | Description of the listing |
| price | float | Price of the listing |

#### Get a specific listing by its id  
**GET /api/listing/{listing_id}**   
Status code 200 if the listing is found with the listing data  

#### Edit a listing you own  
**PUT /api/listing/{listing_id}**   
If the edit was successful, status code 200 is returned  
| KEY | Type | Description |
| --- | ------ | ----------- |
| title | string | Title of the listing |
| description | string | Description of the listing |
| price | float | Price of the listing |

#### Delete a listing  
**DELETE /api/listing/{listing_id}**   
Deletes the listing if it belongs to the user making the request  

#### Get the pictures of a listing  
**GET /api/listing/pictures/{listing_id}/**   
Returns the data regarding the pictures a listing might have.  
Could return nothing  

#### Add a picture to a listing   
**POST /api/listing/pictures/{listing_id}**    
Code 201 if successful  
| KEY | Type | Description |
| --- | ------ | ----------- |
| listing_picture | image file | The file of the image you want to tag to your listing |

#### Delete a picture of a listing
**DELETE /api/listing/pictures/{listing_id}**   
Code 200 on success  
| KEY | Type | Description |
| --- | ------ | ----------- |
| listing_picture | image file | The file of the image you want to tag to your listing |
| listing_picture_file_name | string | A string of the filename of the image you want to remove from the listing |

#### Get the image file of a listing picture  
**GET /api/listing/picture/{listing_picture_file_name}**   
If successful, returns the image file of the picture needed.  

#### Get all others listings  
**GET /api/other/listing**   
Gets all the listings that do not belong to the logged in user.  

### Offers

#### Get the offers of a listing  
**GET /api/offer/{listing_id}**   
Returns all the offers related to a listing  

#### Add an offer to a listing  
**POST /api/offer/{listing_id}**   
Adds an offer to a listing if the user does not own the listing.   
Code 200 when successful
| KEY | Type | Description |
| --- | ------ | ----------- |
| offer_price | float | Price of the listing |

#### Edit an existing offer on a listing  
**PUT /api/offer/{listing_id}**   
Edit the offer if the user has placed an offer on the listing before and he also does not own the listing.  
| KEY | Type | Description |
| --- | ------ | ----------- |
| offer_price | float | Price of the listing |

#### Delete's the logged in user's offer on a listing  
**DELETE /api/offer/{listing_id}**   
Deletes the offer the logged in user might had have on a listing. He needs to have a listing previously and does not own the listing.  

#### Check if the logged in user has placed an offer on the listing  
**GET /api/offer/check/{listing_id}**   
Returns the boolean value if the user has placed an offer on the listing.  
True &rarr; Has placed an offer.  
False &rarr; Has not placed an offer.  

#### Get the current offer the user has placed on the listing  
**GET /api/offer/user/{listing_id}**   
Will throw error if there is no offer placed.  
Returns the offer amount made on the listing by the user.  

---  
### User

#### GET a user's profile  
**GET /api/user**   
Gets the logged in user's profile  

#### Edit's the current user profile  
**PUT /api/user**   
Returns Code 204 if successful  
| KEY | Type | Description |
| --- | ------ | ----------- |
| avatar_icon | image file | The avatar icon of the user |
| username | string | The username of the user |
| password | string | The password of the user in plain text |

#### Get the user avatar icon  
**GET /api/user/avatar_icon**   
Returns the logged in user's avatar icon image file.  

#### Get other users data  
**GET /api/user/other/{user_id}**   
Returns data on another user if the user_id exists.  

#### Get the avatar icon of other users  
**GET /api/user/other/{user_id}/avatar_icon**   
Sends the image file of the user avatar icon if it exists.  

---  
### Likes

#### Get the information of the likes of a listing   
**GET /api/like/{listing_id}**   
The user must own the listing to view this.  

#### Add a like to listing  
**POST /api/like/{listing_id}**   
No body is required for this, just need to make sure you are not liking your own listing.  
Also cannot like a listing you already liked.  

#### Unlike a listing/Delete your like  
**DELETE /api/like/{listing_id}**   
Unlikes a listings you have liked before. Cannot unlike a listing you have not liked  

#### Check if you have liked a listing before  
**GET /api/like/check/{listing_id}**   
Retuns the boolean value of if you have liked a listing before.  
Cannot be your own listing.  
True &rarr; Has liked  
False &rarr; Has not liked  

---  
### Search

#### Search for a listing or user  
**POST /api/search/**   
Returns the results of the search  
| KEY | Type | Description |
| --- | ------ | ----------- |
| type | string | Type of search, either `listing` or `user` |
| search | string | search query |

