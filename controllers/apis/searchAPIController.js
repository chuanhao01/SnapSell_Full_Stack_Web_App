// This file contains controllers pertaining to:
// Anything that has to do with search API, like CUP operations

// Importing dataAccess object to interface with the DB
const dataAccess = require('../../db/index');

const searchAPIController = {
    init(app){
        app.post('/api/search', function(req, res){
            new Promise((resolve) => {
                resolve(
                    new Promise((resolve, reject) => {
                        if(req.body.type === 'Listings' || req.body.type === 'Users'){
                            // If the type is valid
                            resolve(true);
                        }
                        else{
                            // Type does not exists
                            const err = new Error('Search type does not exists');
                            err.code = 'SEARCH_TYPE';
                            reject(err);
                        }
                    })
                    .catch(
                        function(err){
                            console.log(err);
                            res.status(404).send({
                                'Error': err.message,
                                'error_code': err.code
                            });
                            throw err.code;
                        }
                    )
                );
            })
            .then(
                function(){
                    return new Promise((resolve) => {
                        if(req.body.type === 'Listings'){
                            // Search for listing
                            resolve(
                                dataAccess.listing.searchWithUser(req.body.search, req.user.user_id)
                            );
                        }
                        else if(req.body.type === 'Users'){
                            // Search for users
                            resolve(
                                dataAccess.listing.searchWithUser(req.body.search, req.user.user_id)
                            );
                        }
                    })
                    .catch(
                        function(err){
                            // Any Mysql error is captured here
                            console.log(err);
                            res.status(500).send({
                                'Error': 'MySQL Error',
                                'error_code': 'MYSQL_ERR'
                            });
                            throw 'MYSQL_ERR';
                        }
                    );
                }
            )
            .then(
                function(data){
                    res.status(200).send({
                        'Result': 'Search was successful',
                        'data': data
                    });
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