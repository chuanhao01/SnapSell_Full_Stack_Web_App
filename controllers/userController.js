// This file contains controllers pertaining to:
// Anything that the users does, mostly serving of user pages

/*
Note: 
Here req.user has all the information of the user
*/

const userController = {
    init(app){
        const parent_dir = 'pages/user/';
        const listing_parent_dir = parent_dir + 'listings/';
        // users home page
        app.get('/user/home', function(req, res){
            res.render(parent_dir + 'userHome', {
                'title': `Welcome ${req.user.username}`
            });
        });
        // Listings
        // Adding a listing
        app.get('/user/listing/add', function(req, res){
            res.render(listing_parent_dir + 'addListing', {
                'title': 'Add a listing'
            });
        });
        // View all of the user's listings
        app.get('/user/listing', function(req, res){
            res.render(listing_parent_dir + 'viewUserListings', {
                'title': 'Looking at your own listings'
            });
        });
        // View a specific listing
        app.get('/user/listing/:listing_id', function(req, res){
            res.render(listing_parent_dir + 'viewUserSingleListing', {
                'title': 'Looking at listing'
            });
        });
        // Edit a specific listing
        app.get('/user/listing/edit/:listing_id', function(req, res){
            res.render(listing_parent_dir + 'editUserSingleListing', {
                'title': 'Editing a listing'
            });
        });
        // Others
        // Looking at other listing
        app.get('/listing', function(req, res){
            res.render(listing_parent_dir + 'viewOtherListings', {
                'title': 'Looking at other listings'
            });
        });
        // Looking at an individual listing
        app.get('/listing/:listing_id', function(req, res){
            res.render(listing_parent_dir + 'viewOtherSingleListing', {
                'title': 'Viewing a listing'
            });
        });
        // Add an offering
        app.get('/listing/offer/:listing_id', function(req, res){
            res.render(listing_parent_dir + 'addOffering', {
                'title': 'Adding an offering'
            });
        });
    }
};

module.exports = userController;