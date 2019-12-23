// This file contains controllers pertaining to:
// Anything that has to do with listings such as the CRUD of listings


// Importing dataAccess object to interface with the DB
const dataAccess = require('../../db/index');

const listingAPIController = {
    init(app){
        // Adding a listing
        app.post('/api/listing', function(req, res){
            new Promise((resolve) => {
                resolve(
                    // Tries to create a new listing based on request
                    dataAccess.listing.createANewListing(req.body.title, req.body.description, req.body.price, req.user.user_id)
                    .catch(
                        function(err){
                            // If there is any MySQL errors
                            console.log(err);
                            res.status(500).send({
                                'Error': 'MySQL error',
                                'error_code': err.code
                            });
                            throw 'MySQL_ERR';
                        }
                    )
                );
            })
            .then(
                function(){
                    // If the listing is created 
                    res.status(201).send({
                        'Result': 'Listing successfully created'
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
        // Getting all the listing for a particular user
        app.get('/api/listing', function(req, res){
            new Promise((resolve) => {
                resolve(
                    dataAccess.listing.getUserListings(req.user.user_id)
                    .catch(
                        function(err){
                            // If there was any MySQL errors
                            console.log(err);
                            res.status(500).send({
                                'Error': 'MySQL error',
                                'error_code': err.code
                            });
                            throw 'MYSQL_ERR';
                        }
                    )
                );
            })
            .then(
                function(listings){
                    // Here there could be no listings, this will be dealt with on the front end
                    res.status(200).send({
                        'listings': listings
                    });
                }
            )
            .catch(
                function(err){
                    console.log('Final catch err: ' + err);
                }
            );
        });
        // Getting a listing by listing_id
        app.get('/api/listing/:listing_id', function(req, res){
            new Promise((resolve) => {
                resolve(
                    dataAccess.listing.getListingById(req.params.listing_id)
                    .catch(
                        function(err){
                            console.log(err);
                            res.status(500).send({
                                'Error': 'MySQL_ERR',
                                'error_code': err.code
                            });
                            throw 'MySQL_ERR';
                        }
                    )
                );
            })
            .then(
                function(listing){
                    return new Promise((resolve, reject) => {
                        if(listing.length === 0){
                            // If listing is not found
                            const err = new Error('Listing not found');
                            err.code = 'LISTING_NOT_FOUND';
                            reject(err);
                            
                        }
                        else{
                            resolve(listing[0]);
                        }
                    })
                    .catch(
                        function(err){
                            console.log(err);
                            res.status(404).send({
                                'Error': 'Listing not found',
                                'error_code': err.code
                            });
                        }
                    );
                }
            )
            .then(
                function(listing){
                    // If the listing is found
                    res.status(200).send({
                        'listing': listing
                    });
                }
            )
            .catch(
                function(err){
                    console.log('Final catch err: ' + err);
                }
            );
        });
        app.put('/api/listing/:listing_id', function(req, res){
            new Promise((resolve) => {
                resolve(
                    dataAccess.listing.checkIfUserListing(req.params.listing_id, req.user.user_id)
                    .catch(
                        function(err){
                            // If there are any MySQL errors
                            console.log(err);
                            res.status(500).send({
                                'Error': 'MySQL Error',
                                'error_code': err.code
                            });
                            throw 'MySQL_ERR';
                        }
                    )
                );
            })
            .then(
                function(user_listing_own){
                    // Here we check if the user sending the request own the listing
                    return new Promise((resolve, reject) =>{
                        if(user_listing_own){
                            // If he does own his own listing
                            // Then continue
                            resolve(true);
                        }
                        else{
                            // If they dont own the listing
                            const err = new Error('Listing does not belong to user');
                            err.code = 'USER_UNAUTH_LISTING';
                            reject(err);
                        }
                    })
                    .catch(
                        function(err){
                            console.log(err);
                            res.status(401).send({
                                'Error': 'You cannot edit this listing',
                                'error_code': 'USER_UNAUTH_LISTING'
                            });
                            throw err.code;
                        }
                    );
                }
            )
            .then(
                function(){
                    // If you can edit the listing
                    return dataAccess.listing.editUserListing(req.params.listing_id, req.body.title, req.body.description, req.body.price)
                    .catch(
                        function(err){
                            console.log(err);
                            res.status(500).send({
                                'Error': 'MySQL Error',
                                'error_code': err.code
                            });
                            throw 'MySQL_ERR';
                        }
                    );
                }
            )
            .then(
                function(){
                    // if update is successful
                    res.status(200).send({
                        'Result': 'Update successful'
                    });
                }
            )
            .catch(
                function(err){
                    console.log('Final catch err: ' + err);
                }
            );
        });
        // Deleting a listing
        // TODO: Fix for final version
        app.delete('/api/listing/:listing_id', function(req, res){
            new Promise((resolve) => {
                resolve(
                    dataAccess.listing.checkIfUserListing(req.params.listing_id, req.user.user_id)
                    .catch(
                        function(err){
                            console.log(err);
                            res.status(500).send({
                                'Error': 'MySQL Error',
                                'error_code': err.code
                            });
                            throw 'MySQL_ERR';
                        }
                    )
                );
            })
            .then(
                function(user_listing_own){
                    return new Promise((resolve, reject) =>{
                        if(user_listing_own){
                            // If the user does own the listing
                            resolve(true);
                        }
                        else{
                            const err = new Error('Listing does not belong to user');
                            err.code = 'USER_UNAUTH_LISTING';
                            reject(err);
                        }
                    })
                    .catch(
                        function(err){
                            console.log(err);
                            res.status(401).send({
                                'Error': 'You cannot edit this listing',
                                'error_code': 'USER_UNAUTH_LISTING'
                            });
                            throw err.code;
                        }
                    );
                }
            )
            .then(
                function(){
                    // If the user does have access to the listing
                    return dataAccess.listing.deleteAListing(req.params.listing_id)
                    .catch(
                        function(err){
                            console.log(err);
                            res.status(500).send({
                                'Error': 'MySQL Error',
                                'error_code': err.code
                            });
                            throw 'MySQL_ERR';
                        }
                    );
                }
            )
            .then(
                function(){
                    // If the listing was successfully deleted
                    res.status(200).send({
                        'Result': 'Product was successfully deleted'
                    });
                }
            )
            .catch(
                function(err){
                    console.log('Final catch err: ' + err);
                }
            );
        });
        // Others
        // Getting all other listing
        app.get('/api/other/listing', function(req, res){
            new Promise((resolve) => {
                resolve(
                    dataAccess.listing.getOtherListing(req.user.user_id)
                    .catch(
                        function(err){
                            console.log(err);
                            res.status(500).send({
                                'Error': 'MySQL Error',
                                'error_code': err.code
                            });
                            throw 'MySQL_ERR';
                        }
                    )
                );
            })
            .then(
                function(listings){
                    // If getting the listings were successful
                    res.status(200).send({
                        'listings': listings 
                    });
                }
            )
            .catch(
                function(err){
                    console.log('Final catch err: ' + err);
                }
            );
        });
    }
};

module.exports = listingAPIController;