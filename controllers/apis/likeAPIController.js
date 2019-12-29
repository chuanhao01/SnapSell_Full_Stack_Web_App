// This file contains controllers pertaining to:
// Anything that has to do with likesg such as the CRUD of likes

// Importing dataAccess object to interface with the DB
const dataAccess = require('../../db/index');

const likeAPIController = {
    init(app){
        // Add a like to a listing
        app.post('/api/like/:listing_id', function(req, res){
            new Promise((resolve) => {
                resolve(
                    dataAccess.listing.checkIfUserListing(req.params.listing_id, req.user.user_id)
                    .catch(
                        function(err){
                            // If there is any MySQL errors
                            console.log(err);
                            res.status(500).send({
                                'Error': 'MySQL error',
                                'error_code': 'MySQL_ERR'
                            });
                            throw 'MySQL_ERR';
                        }
                    )
                );
            })
            .then(
                function(user_listing_own){
                    return new Promise((resolve, reject) => {
                        if(user_listing_own){
                            const err = new Error('User liking his own post');
                            err.code = 'USER_LIKING_OWN_LISTING';
                            reject(err);
                        }
                        else{
                            resolve(true);
                        }
                    })
                    .catch(
                        function(err){
                            console.log(err);
                            res.status(401).send({
                                'Error': 'User liking own post',
                                'error_code': err.code
                            });
                            throw err.code;
                        }
                    );
                }
            )
            .then(
                function(){
                    return dataAccess.like.checkLike(req.params.listing_id, req.user.user_id)
                    .catch(
                        function(err){
                            // If there is any MySQL errors
                            console.log(err);
                            res.status(500).send({
                                'Error': 'MySQL error',
                                'error_code': 'MySQL_ERR'
                            });
                            throw 'MySQL_ERR';
                        }
                    );
                }
            )
            .then(
                function(user_like_before){
                    return new Promise((resolve, reject) => {
                        if(!user_like_before){
                            // If the user has not liked the listing before
                            resolve(true);
                        }
                        else{
                            // If the user has liked the listing before
                            const err = new Error('User has liked the post before');
                            err.code = 'USER_LIKED_BEFORE';
                            reject(err);
                        }
                    })
                    .catch(
                        function(err){
                            console.log(err);
                            res.status(401).send({
                                'Error': 'User has liked the post before',
                                'error_code': err.code
                            });
                            throw err.code;
                        }
                    );
                }
            )
            .then(
                function(){
                    // If the user has not liked the post before
                    return dataAccess.like.likeAListing(req.params.listing_id, req.user.user_id)
                    .catch(
                        function(err){
                            console.log(err);
                            res.status(500).send({
                                'Error': 'MySQL error',
                                'error_code': 'MySQL_ERR'
                            });
                            throw 'MySQL_ERR';
                        }
                    );
                }
            )
            .then(
                function(){
                    // If the like was successful
                    res.status(200).send({
                        'Result': 'Like was successful'
                    });
                }
            )
            .catch(
                function(err){
                    // Final catch for all errors
                    console.log('Final catch err: ' + err);
                }
            );
        });
        // Endpoint for unliking a listing
        app.delete('/api/like/:listing_id', function(req, res){
            new Promise((resolve) => {
                resolve(
                    dataAccess.like.checkLike(req.params.listing_id, req.user.user_id)
                    .catch(
                        function(err){
                            // If there is any MySQL errors
                            console.log(err);
                            res.status(500).send({
                                'Error': 'MySQL error',
                                'error_code': 'MySQL_ERR'
                            });
                            throw 'MySQL_ERR';
                        }
                    )
                );
            })
            .then(
                function(user_like_before){
                    return new Promise((resolve, reject) => {
                        if(user_like_before){
                            // If the user has not liked the listing before
                            resolve(true);
                        }
                        else{
                            // If the user has liked the listing before
                            const err = new Error('User has not liked the post before');
                            err.code = 'USER_NOT_LIKED_BEFORE';
                            reject(err);
                        }
                    })
                    .catch(
                        function(err){
                            console.log(err);
                            res.status(401).send({
                                'Error': 'User not has liked the post before',
                                'error_code': err.code
                            });
                            throw err.code;
                        }
                    );
                }
            )
            .then(
                function(){
                    // If the user has liked the post before
                    return dataAccess.like.unlikeAListing(req.params.listing_id, req.user.user_id)
                    .catch(
                        function(err){
                            console.log(err);
                            res.status(500).send({
                                'Error': 'MySQL error',
                                'error_code': 'MySQL_ERR'
                            });
                            throw 'MySQL_ERR';
                        }
                    );
                }
            )
            .then(
                function(){
                    // If the like was successful
                    res.status(200).send({
                        'Result': 'Unlike was successful'
                    });
                }
            )
            .catch(
                function(err){
                    // Final catch for all errors
                    console.log('Final catch err: ' + err);
                }
            );
        });
        // Endpoint to check if the listing has been liked the user, returns the boolean
        app.get('/api/like/check/:listing_id', function(req, res){
            new Promise((resolve) => {
                resolve(
                    dataAccess.like.checkLike(req.params.listing_id, req.user.user_id)
                    .catch(
                        function(err){
                            console.log(err);
                            res.status(500).send({
                                'Error': 'MySQL error',
                                'error_code': 'MySQL_ERR'
                            });
                            throw 'MySQL_ERR';
                        }
                    )
                );
            })
            .then(
                function(user_like_before){
                    res.status(200).send({
                        like_before: user_like_before
                    });
                }
            )
            .catch(
                function(err){
                    // Final catch for all errors
                    console.log('Final catch err: ' + err);
                }
            );
        });
    }
};

module.exports = likeAPIController;