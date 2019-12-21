// This file contains controllers pertaining to:
// Anything that the users does, mostly serving of user pages

/*
Note: 
Here req.user has all the information of the user
*/

const userController = {
    init(app){
        const parent_dir = 'pages/user/';
        // users home page
        app.get('/user/home', function(req, res){
            res.render(parent_dir + 'userHome', {
                'title': `Welcome ${req.user.username}`
            });
        });
        // Listings
        // Adding a listing
        // app.get('/user/listing', function(req, res){

        // });
    }
};

module.exports = userController;