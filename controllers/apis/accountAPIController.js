// This file contains controllers pertaining to:
// APIs endpoint for accounts, such as login or creating an account

// Importing other libs
const path = require('path');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
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
                        res.status(422).send({'Error': 'Wrong file extension'});
                        return;
                    }
                    // File uploaded is too large
                    else if(err.code === 'LIMIT_FILE_SIZE'){
                        res.status(413).send({'Error': 'File sent is too large'});
                        return;
                    }
                }
                // If there is no error in uploading the file
                // Creating the new user now
                dataAccess.user.createANewUser(req.file.filename, req.body.username, req.body.password)
                    .then(
                        function(){
                            // If creating a user is successful
                            res.status(200).send({'Result': 'User successfully created'});
                        }
                    );
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
                                });
                            }
                            else if(err.code === 'MANY_USERS'){
                                res.status(500).send({
                                    'Error': 'Duplicate users with the username',
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
                                            err.code = 'Login failed';
                                            reject(err);
                                        }
                                    })
                                        .catch(
                                            // Login failed
                                            function(err){
                                                console.log(err);
                                                res.status(401).send({
                                                    'Error': 'Login failed'
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
                        // Generate the tokens here
                        return new Promise((resolve, reject) => {
                            const payload = {
                                'Result': 'This is an access token',
                            };
                            jwt.sign(payload, JWT_SECRET, {
                                algorithm: 'HS256',
                            }, function(err, token){
                                if(err){
                                    // If there is a jwt error
                                    reject(err);
                                }
                                else{
                                    // If the generation is successful
                                    resolve([user.refresh_token, token]);
                                }
                            });
                        })
                            .catch(
                                function(err){
                                    console.log(err);
                                    throw 'JW_ERROR';
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
                    // Ctaching all thrown errors and logging them
                    function(err){
                        console.log(err);
                    }
                );
        });
    }
};

module.exports = accountAPIController;