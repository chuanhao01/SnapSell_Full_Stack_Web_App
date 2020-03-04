# API Reference

Here I will be listing out all the endpoints made and used in the server.  

### Endpoints for loading the front-end html  

#### landing page  
**get /**   
returns the home landing page of the server  

#### login page  
**get /login**   
the normal login page for the user  

#### account creation page
**get /account/create** 
the page for new users to create an account  

---
### below are only accessable to users who are logged in.  
---
#### user's home page  
**get /user/home**  
the logged in user's home page.  

#### user's profile page  
**get /user/profile**   
the page for user's to view their own profile.  

####  user's profile edit page  
**get /user/profile/edit**   
the page to allow users to edit their own profile.  

#### viewing your own listings  
**get /user/listing**  
the page to allow the user to look at his own listings  

#### view one of your own listings  
**get /user/listing/{listing_id}**  
the page where you get to look more specifically at your own listing.

#### add a listing  
**get /user/listing/add**   
the page to add a listing  

#### add a picture to your listing  
**get /user/listing/picture/add/{listing_id}**  
the page to add more pictures to one your own specific listings  

#### edit the pictures one of your listings has  
**get /user/listing/picture/edit/{listing_id}**   
the page to edit the pictures your listings has.  

#### edit one of your own listings  
**get /user/listing/edit/{listing_id}**  
the page to edit one of your own listings  

#### look at all other listings  
**get /listings**  
the page where the user gets to select what listings he want to look at. note he will not see any of his own listings  

#### looking at a specific listing  
**get /listing/{listing_id}**  
the page where the user can specifically look at listing he might want to place an offer on. note, cannot be his own listings.  

#### place an offer on a listing  
**get /listing/offer/{listing_id}**   
the page for the user to add an offer to a listing.  

#### edit an existing offer  
**get /listing/offer/edit/{listing_id}**  
the page to edit an offer a user might already have on a listing.  

#### searching for a listing or user  
**get /search?**  
the page where the user can search for a listing or user.  

---  
from here on, we will be doing api endpoints, where it might recieve and respond with data, rather than html pages.  

the following do not require the user to be logged in.

#### creating an account  
**post /api/account**    
the endpoint to create an account.  
responds with 201 for success.

| key | type | description |
| --- | ------ | ----------- |
| avatar_icon | image file | the avatar icon of the user |
| username | string | the username of the user |
| password | string | the password of the user in plain text |

#### login to your account  
**post /api/login**   
the api to send your login credentials to get your `access_token` and `refresh_token`.  
responds with 200 for successful login.  

| key | type | description |
| --- | ------ | ----------- |
| username | string | the username of the user |
| password | string | the password of the user in plain text |

#### generate another access_token based on your refresh_token  
**get /api/refresh_token**   
200 success will have the new access_token  

| key | type | description |
| --- | ------ | ----------- |
| refresh_token | string | the jwt `refresh_token` given when you login |

---

the api endpoints below do require the user to be logged in.

---

### listings

#### get all of your own listings  
**get /api/listing**   
returns 200 with all of your listings if you are logged in.  

#### add a listing  
**post /api/listing**   
status code 201 on success  

| key | type | description |
| --- | ------ | ----------- |
| title | string | title of the listing |
| description | string | description of the listing |
| price | float | price of the listing |

#### get a specific listing by its id  
**get /api/listing/{listing_id}**   
status code 200 if the listing is found with the listing data  

#### edit a listing you own  
**put /api/listing/{listing_id}**   
if the edit was successful, status code 200 is returned  

| key | type | description |
| --- | ------ | ----------- |
| title | string | title of the listing |
| description | string | description of the listing |
| price | float | price of the listing |

#### delete a listing  
**delete /api/listing/{listing_id}**   
deletes the listing if it belongs to the user making the request  

#### get the pictures of a listing  
**get /api/listing/pictures/{listing_id}/**   
returns the data regarding the pictures a listing might have.  
could return nothing  

#### add a picture to a listing   
**post /api/listing/pictures/{listing_id}**    
code 201 if successful  

| key | type | description |
| --- | ------ | ----------- |
| listing_picture | image file | the file of the image you want to tag to your listing |

#### delete a picture of a listing
**delete /api/listing/pictures/{listing_id}**   
code 200 on success  

| key | type | description |
| --- | ------ | ----------- |
| listing_picture | image file | the file of the image you want to tag to your listing |
| listing_picture_file_name | string | a string of the filename of the image you want to remove from the listing |

#### get the image file of a listing picture  
**get /api/listing/picture/{listing_picture_file_name}**   
if successful, returns the image file of the picture needed.  

#### get all others listings  
**get /api/other/listing**   
gets all the listings that do not belong to the logged in user.  

### offers

#### get the offers of a listing  
**get /api/offer/{listing_id}**   
returns all the offers related to a listing  

#### add an offer to a listing  
**post /api/offer/{listing_id}**   
adds an offer to a listing if the user does not own the listing.   
code 200 when successful

| key | type | description |
| --- | ------ | ----------- |
| offer_price | float | price of the listing |

#### edit an existing offer on a listing  
**put /api/offer/{listing_id}**   
edit the offer if the user has placed an offer on the listing before and he also does not own the listing.  

| key | type | description |
| --- | ------ | ----------- |
| offer_price | float | price of the listing |

#### delete's the logged in user's offer on a listing  
**delete /api/offer/{listing_id}**   
deletes the offer the logged in user might had have on a listing. he needs to have a listing previously and does not own the listing.  

#### check if the logged in user has placed an offer on the listing  
**get /api/offer/check/{listing_id}**   
returns the boolean value if the user has placed an offer on the listing.  
true &rarr; has placed an offer.  
false &rarr; has not placed an offer.  

#### get the current offer the user has placed on the listing  
**get /api/offer/user/{listing_id}**   
will throw error if there is no offer placed.  
returns the offer amount made on the listing by the user.  

---  
### user

#### get a user's profile  
**get /api/user**   
gets the logged in user's profile  

#### edit's the current user profile  
**put /api/user**   
returns code 204 if successful  

| key | type | description |
| --- | ------ | ----------- |
| avatar_icon | image file | the avatar icon of the user |
| username | string | the username of the user |
| password | string | the password of the user in plain text |

#### get the user avatar icon  
**get /api/user/avatar_icon**   
returns the logged in user's avatar icon image file.  

#### get other users data  
**get /api/user/other/{user_id}**   
returns data on another user if the user_id exists.  

#### get the avatar icon of other users  
**get /api/user/other/{user_id}/avatar_icon**   
sends the image file of the user avatar icon if it exists.  

---  
### likes

#### get the information of the likes of a listing   
**get /api/like/{listing_id}**   
the user must own the listing to view this.  

#### add a like to listing  
**post /api/like/{listing_id}**   
no body is required for this, just need to make sure you are not liking your own listing.  
also cannot like a listing you already liked.  

#### unlike a listing/delete your like  
**delete /api/like/{listing_id}**   
unlikes a listings you have liked before. cannot unlike a listing you have not liked  

#### check if you have liked a listing before  
**get /api/like/check/{listing_id}**   
retuns the boolean value of if you have liked a listing before.  
cannot be your own listing.  
true &rarr; has liked  
false &rarr; has not liked  

---  
### search

#### search for a listing or user  
**post /api/search/**   
returns the results of the search  

| key | type | description |
| --- | --- | --- |
| type | string | type of search, either `listing` or `user` |
| search | string | search query |

