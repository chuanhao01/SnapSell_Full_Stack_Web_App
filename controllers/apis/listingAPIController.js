// This file contains controllers pertaining to:
// Anything that has to do with listings such as the CRUD of listings


// Importing dataAccess object to interface with the DB
const dataAccess = require('../../db/index');

const listingAPIController = {
    init(app){
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
        // Deleting a listing
        app.delete('/api/listing/:listing_id', function(req, res){
            new Promise((resolve) => {
                resolve(
                    dataAccess.listing.checkIfUserListing(req.params.listing_id, req.user.user_id)
                    .catch(
                        function(err){
                            console.log(err);
                            if(err.code === 'USER_UNAUTH_LISTING'){
                                res.status(401).send({
                                    'Error': 'You cannot edit this listing',
                                    'error_code': 'USER_UNAUTH_LISTING'
                                });
                                throw err.code;
                            }
                            else{
                                res.status(500).send({
                                    'Error': 'MySQL Error',
                                    'error_code': err.code
                                });
                                throw 'MySQL_ERR';
                            }
                        }
                    )
                );
            })
            .then(
                function(){
                    // If the user does have access to the listing
                    return dataAccess.listing.deleteAListing(req.params.listing_id)
                    .catch(
                        function(err){
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
    }
};

module.exports = listingAPIController;