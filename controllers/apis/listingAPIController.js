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
    }
};

module.exports = listingAPIController;