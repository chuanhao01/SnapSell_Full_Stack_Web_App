// This file contains controllers pertaining to:
// APIs endpoint for accounts, such as login or creating an account
const accountAPIController = {
    init(app){
        app.post('/api/account', function(req, res){
            console.log(req.body);
            res.send('hello');
        });
    }
};

module.exports = accountAPIController;