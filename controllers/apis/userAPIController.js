// This file contains controllers pertaining to:
// Anything that has to do with offers such as the CRUD of listings

// Importing dataAccess object to interface with the DB
const dataAccess = require('../../db/index');

const userAPIController = {
    init(app){
        app.get('/api/user/id', function(req, res){
            // Returns the user_id of the user
            res.status(200).send({
                'user_id': req.user.user_id
            });
        });
    }
};

module.exports = userAPIController;