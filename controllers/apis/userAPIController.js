// This file contains controllers pertaining to:
// Anything that has to do with offers such as the CRUD of listings

// Importing dataAccess object to interface with the DB
const dataAccess = require('../../db/index');

const userAPIController = {
    init(app){
        const avatar_icon_file_base_path = '/uploads/avatarIcons/' ;
        // Get the user basic info
        app.get('/api/user', function(req, res){
            res.status(200).send({
                'user': {
                    'username': req.user.username,
                }
            });
        });
        // Gets the user's avatar_icon
        app.get('/api/user/avatar_icon', function(req, res){
            res.sendFile(process.cwd() + avatar_icon_file_base_path + req.user.avatar_icon_file_name, function(err){
                if(err){
                    console.log(err);
                    res.status(500).send({
                        'Error': 'Error retriving avatar',
                        'error_code': 'GET_AVATAR_ERROR' 
                    });
                }
            });
        });
    }
};

module.exports = userAPIController;