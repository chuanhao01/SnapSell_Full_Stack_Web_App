// This file contains controllers pertaining to:
// Anything that the users does

/*
Note: 
Here req.user has all the information of the user
*/

const userController = {
    init(app){
        const parentDir = 'pages/user/';
        app.get('/user/home', function(req, res){
            res.render(parentDir + 'userHome', {
                'title': `Welcome ${req.user.username}`
            });
        });
    }
};

module.exports = userController;