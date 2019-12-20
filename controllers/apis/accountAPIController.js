// This file contains controllers pertaining to:
// APIs endpoint for accounts, such as login or creating an account

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
const utils = require('../../utils/index');

const accountAPIController = {
    init(app){
        // When using axios to send a request, the data is stored in req.body
        // Endpoint to create an account
        app.post('/api/account', function(req, res){
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
                    // Creating the new user now
                    dataAccess.user.createANewUser(req.file.filename, req.body.username, req.body.password)
                    .then(
                        function(){
                            // If creating a user is successful
                            res.status(200).send({'Result': 'User successfully created'});
                        }
                    );
                }
            });
        });
        // Endpoint for logging in
        app.post('/api/login', function(req, res){
                dataAccess.user.getUserByUsername(req.body.username)
                .catch(
                    function(err){
                        // Gettting user by username errors
                        console.log(err);
                        if(err.code === 'USER_NOT_EXIST'){
                            res.status(500).send({
                                'Error': 'User does not exist',
                                'error_code': err.code
                            });
                        }
                        else if(err.code === 'MANY_USERS'){
                            res.status(500).send({
                                'Error': 'Duplicate users with the username',
                                'error_code': err.code
                            });
                        }
                        throw 'GET_USER_ERR';
                    }
                )
                .then(
                    function(user){
                        // Checking if the credentials are correct
                        return dataAccess.user.checkPassword(req.body.password, user.password)
                            .catch(
                                // Error from checking bcrypt
                                function(err){
                                    console.log(err);
                                    res.status(500).send({
                                        'Error': 'Bcrypt error',
                                        'error_code': err.code
                                    });
                                    throw 'Bcrypt error';
                                }
                            )
                            .then(
                                function(same){
                                    return new Promise((resolve, reject) => {
                                        if(same){
                                            // Login successful move on
                                            resolve(user);
                                        }
                                        else{
                                            // Login failed move to catch it
                                            const err = new Error('Login failed');
                                            err.code = 'LOGIN_FAILED';
                                            reject(err);
                                        }
                                    })
                                        .catch(
                                            // Login failed
                                            function(err){
                                                console.log(err);
                                                res.status(401).send({
                                                    'Error': 'Login failed',
                                                    'error_code': err.code
                                                });
                                                throw 'Login failed';
                                            }
                                        );
                                }
                            );
                    }
                )
                .then(
                    // Login is successful
                    function(user){
                        // Generate the access token
                        return utils.jwt.generateAccessToken(user)
                            .catch(
                                function(err){
                                    console.log(err);
                                    res.status(500).send({
                                        'Error': 'JWT error',
                                        'error_code': err.code
                                    });
                                    throw 'JWT_ERROR';
                                }
                            );
                    }
                )
                .then(
                    // If generation of tokens is successful
                    function([refresh_token, access_token]){
                        res.status(200).send({
                            'refresh_token': refresh_token,
                            'access_token': access_token
                        });
                    }
                )
                .catch(
                    // Final catch all thrown errors and logging them
                    function(err){
                        console.log(err);
                    }
                );
        });
        app.get('/api/refresh_token', function(req, res){
            if(req.cookies.refresh_token){
                // If refresh token exists
                dataAccess.user.getUserByRefreshToken(req.cookies.refresh_token)
                .catch(
                    // Errors in getting the user from MySQL
                    function(err){
                        console.log(err);
                        if(err.code === 'INVALID_TOKEN'){
                            // Refresh token given is invalid or cannot be found
                            res.status(401).send({
                                'Error': 'Invalid refresh token',
                                'error_code': err.code
                            });
                            return;
                        }
                        else{
                            res.status(500).send({
                                'Error': 'MySQL error',
                                'error_code': err.code
                            });
                            return;
                        }
                    }
                )
                .then(
                    function(user){
                        // If successful in getting the user
                        return utils.jwt.generateAccessToken(user)
                            .catch(
                                function(err){
                                    console.log(err);
                                    res.status(500).send({
                                        'Error': 'JWT error',
                                        'error_code': err.code
                                    });
                                    throw 'JWT_ERROR';
                                }
                            );
                    }
                )
                .then(
                    // If generation of the access token is successful 
                    function([refresh_token, access_token]){
                        res.status(200).send({
                            'access_token': access_token,
                        });
                    }
                )
                .catch(
                    // Final catch for all other errors
                    function(err){
                        console.log(err);
                    }
                );
            }
            else{
                // If the refresh token does not exists
                res.status(400).send({
                    'Error': 'Refresh token missing',
                    'error_code': 'NO_TOKEN',
                });
            }
        });
    }
};

module.exports = accountAPIController;