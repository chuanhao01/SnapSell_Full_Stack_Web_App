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

const accountAPIController = {
    init(app){
        // When using axios to send a request, the data is stored in req.body
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
                            res.status(200).send({'Result': 'User successfully created'});
                        }
                    );
            });
        });
    }
};

module.exports = accountAPIController;