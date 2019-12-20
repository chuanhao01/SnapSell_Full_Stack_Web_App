// This file is for all the API end points required in the BED CA1 Assignment 2019
// In this file there might be some repeats from the other files

/*
Name: Lim CHuan Hao
Class: DIT/FT/1B/11
Admin number: 19222764
*/

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

// Importing dataAccess for db access
const dataAccess = require('../../db/index');

const assignmentAPIController= {
    init(app){
        // Q1 GET /users`
        app.get('/users', function(req, res){
            dataAccess.assignment.getUsers()
            .then(
                function(users){
                    res.status(200).send(users);
                }
            )
            .catch(
                function(err){
                    if(err){
                        res.status(500).send({
                            'Condition': 'Unknown error',
                            'Code': '500 Internal Server Error'
                        });
                    }
                }
            );
        });
        // Q2 POST /users
        app.post('/users', function(req, res){
            upload(req, res, function(err){
                // Cataching errors in the file uploaded
                if(err){
                    res.status(500).send({
                        'Condition': 'Unknown error',
                        'Code': '500 Internal Server Error'
                    });
                }
                else{
                    // If there is no error in uploading the file
                    // Creating the new user now
                    dataAccess.assignment.postUsers(req.file.filename, req.body.username, req.body.password)
                    .then(
                        function(user_id){
                            // If creating a user is successful
                            res.status(201).send({
                                'user_id': user_id
                            });
                        }
                    );
                }
            });
        });
        // Q3 GET /users/:id
        app.get('/users/:id', function(req, res){
            const user_id = req.params.id;
            dataAccess.assignment.getUsersId(user_id)
            .then(
                function(user){
                    // Got the user
                    res.status(200).send(user);
                }
            )
            .catch(
                function(err){
                    if(err){
                        res.status(500).send({
                                'Condition': 'Unknown error',
                                'Code': '500 Internal Server Error'
                        });
                    }
                }
            );
        });
    }
};

module.exports = assignmentAPIController;