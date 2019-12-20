// This file is for all the API end points required in the BED CA1 Assignment 2019
// In this file there might be some repeats from the other files

/*
Name: Lim CHuan Hao
Class: DIT/FT/1B/11
Admin number: 19222764
*/

// Importing other libs I need to use
const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 13;

// Exported object
const assignmentDB = {
    init(pool){
        this.pool = pool;
    },
    // Q1 GET /users`
    getUsers(){
        return new Promise((resolve, reject) => {
            this.pool.query(`
            SELECT * FROM USERS
            `, function(err, data){
                if(err){
                    reject(err);
                }
                else{
                    resolve(data);
                }
            });
        });
    },
    // Q2 POST /users
    postUsers(avatar_icon_file_name, username, password){
        return new Promise(async (resolve, reject) => {
            // First part here is to generate all the corrosponding data fields
            // Generating userid and password hash
            const user_id = uuid();
            const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
            // Generating the refresh token for user
            const payload = {
                'Result': 'This is a refresh token',
            };
            jwt.sign(payload, JWT_SECRET, {
                algorithm: 'HS256',
            }, function(err, token){
                if(err){
                    console.error(err);
                    return reject(err);
                }
                // If all are successful in generating, resolve with all generated data
                return resolve([user_id, password_hash, token]);
            });
        })
        .then(
            function([user_id, password_hash, token]){
                // Now here we are sending a query to the db to create the user
                // Deleted is given to be 0 on creation
                return new Promise((resolve, reject) => {
                    this.pool.query(`
                    INSERT INTO USERS
                    (user_id, username, password, avatar_icon_file_name, refresh_token, deleted)
                    values
                    (?, ?, ?, ?, ?, ?)
                    `, [user_id, username, password_hash, avatar_icon_file_name, token, 0], function(err, data){
                        if(err){
                            return reject(err);
                        }
                        return resolve(user_id);
                    });
                });
            }.bind(this)
        ); 
    },
    // Q3 GET /users/:id
    getUsersId(user_id){
        return new Promise((resolve, reject) => {
            this.pool.query(`
            SELECT * FROM USERS
            WHERE user_id = ? 
            `, [user_id], function(err, data){
                if(err || data.length === 0){
                    reject('MySQL error');
                }
                else{
                    resolve(data[0]);
                }
            });
        });
    }
};

module.exports = assignmentDB;