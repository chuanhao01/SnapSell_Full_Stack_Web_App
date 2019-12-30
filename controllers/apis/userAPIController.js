// This file contains controllers pertaining to:
// Anything that has to do with offers such as the CRUD of listings

// Importing other libs
const path = require('path');
const multer = require('multer');
const upload = multer({
    // Setting the destination where the avatar icons are stored
    dest: 'uploads/avatarIcons/',
    limits: {
        // 1MB limit for file upload
        fileSize: 1000000,
    },
    // Custom file filter function, only accepting file with image extensions
    // Throws a custom error if there is one
    fileFilter(req, file, cb){
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            let err = new Error('File extension of uploaded file is wrong');
            err.code = 'FILE_EXT';
            return cb(err);
        }
        return cb(null, true);
    }
}).single('avatar_icon');

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
        // Edit user's profile
        app.put('/api/user', function(req, res){
            upload(req, res, function(err){
                // Cataching errors in the file uploaded
                if(err){
                    // File extension is not an img
                    if(err.code === 'FILE_EXT'){
                        res.status(422).send({
                            'Error': 'Wrong file extension',
                            'error_code': err.code
                        });
                        return;
                    }
                    // File uploaded is too large
                    else if(err.code === 'LIMIT_FILE_SIZE'){
                        res.status(413).send({
                            'Error': 'File sent is too large',
                            'error_code': err.code
                        });
                        return;
                    }
                    else{
                        res.status(500).send({
                            'Error': 'Multer error',
                            'error_code': err.code
                        });
                        return;
                    }
                }
                else{
                    // If there is no error in uploading the file
                    // Try to update the user
                    new Promise((resolve) => {
                        resolve(
                            dataAccess.user.editUserProfile(req.user.user_id, req.body.username, req.body.password, req.file.filename)
                            .catch(
                                function(err){
                                    console.log(err);
                                    if(err.code === 'USERNAME_TAKEN'){
                                        // If the user alr exists and there is this error
                                        res.status(422).send({
                                            'Condition': 'The new username provided already exists.',
                                            'error_code': 'USERNAME_TAKEN'
                                        });
                                    }
                                    else{
                                        // Any other error
                                        res.status(500).send({
                                            'Error': 'Internal Error editing profile',
                                            'error_code': 'INTERNAL_ERROR'
                                        });
                                    }
                                    throw 'EDIT_USER_ERR';
                                }
                            )
                        );
                    })
                    .then(
                        function(){
                            // If the update is successful
                            res.status(204).send();
                        }
                    )
                    .catch(
                        function(err){
                            console.log('Final catch err: ' + err);
                        }
                    );
                }
            });
        });
    }
};

module.exports = userAPIController;