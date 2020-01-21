// This file contains controllers pertaining to:
// Anything that has to do with search API, like CUP operations

// Importing dataAccess object to interface with the DB
const dataAccess = require('../../db/index');

const searchAPIController = {
    init(app){
        app.post('/api/search', function(req, res){
            new Promise((resolve) => {
                resolve(
                    new Promise((resolve) => {

                    })
                );
            })
            .then(
                function(){
                    return new Promise((resolve, reject) => {
                        if(req.user === undefined || req.user === null){
                            // If there is no user logined
                            if(req.body.type === 'Listings'){
                                // Search for listing
                                resolve(
                                    dataAccess.listing.searchWithoutUser(req.body.search)
                                    .catch(
                                        function(err){
                                            console.log(err);
                                            res.status(500).send({
                                                'Error': 'MySQL error',
                                                'error_code': 'MYSQL_ERR'
                                            });
                                            throw 'MYSQL_ERR';
                                        }
                                    )
                                );
                            }
                            else if(req.body.type === 'Users'){
                                // Search for users
                            }
                            else{
                                // There is an error
                                const err = new Error('Search type does not exists');
                                err.code = 'SEARCH_TYPE';
                                reject(err);
                            }
                        }
                        else{
                            // If there was a user logined

                        }
                    })               
                }
            )
            .catch(
                function(err){
                    console.log('Final catch err: ' + err);
                }
            );
            // res.send(req.body);
        });
    }
};

module.exports = searchAPIController;