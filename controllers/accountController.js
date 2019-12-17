// This file contains controllers pertaining to:
// Everything that has to deal with the creation and logging in of accounts

const accountController = {
    init(app){
        const parentDir = 'pages/account/';
        app.get('/account/create', function(req, res){
            res.render(parentDir + 'createAccount', {
                'title': 'Create an account'
            }); 
        });
    },
};

module.exports = accountController;