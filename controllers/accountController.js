// This file contains controllers pertaining to:
// Everything that has to deal with the creation and logging in of accounts

const accountController = {
    init(app){
        const parentDir = 'pages/account/';
        // Account creation
        app.get('/account/create', function(req, res){
            res.render(parentDir + 'createAccount', {
                'title': 'Create an account'
            }); 
        });
        // Login
        app.get('/login', function(req, res){
            res.render(parentDir + 'loginAccount', {
                title: 'Login Page',
            });
        });
    },
};

module.exports = accountController;