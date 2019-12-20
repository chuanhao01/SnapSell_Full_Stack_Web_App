// This file is for all the API end points required in the BED CA1 Assignment 2019
// In this file there might be some repeats from the other files

/*
Name: Lim CHuan Hao
Class: DIT/FT/1B/11
Admin number: 19222764
*/

// Importing dataAccess for db access
const dataAccess = require('../../db/index');

const assignmentAPI = {
    init(app){
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
    }
};

module.exports = assignmentAPI;