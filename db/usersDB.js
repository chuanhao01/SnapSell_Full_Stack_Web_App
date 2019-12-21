/*
TODO:
1. Make sure during creation, no duplicate users
*/

// This db file contains:
// Actions pertaining to interacting with the USERS db or interacts with a 'user'

// Importing other libs I need to use
const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 13;

const userDB = {
    init(pool){
        this.pool = pool;
    },
    // Main function for actions in the db below
    createANewUser(avatar_icon_file_name, username, password){
        return new Promise((resolve, reject) => {
            // First part here is to generate password hash
            bcrypt.hash(password, SALT_ROUNDS, function(err, password_hash){
                if(err){
                    // If there are any bcrypt errors
                    reject(err);
                }
                else{
                    // If password_hash was successfully generated
                    resolve(password_hash);
                }
            });
        })
        .then(
            function(password_hash){
                return new Promise((resolve, reject) => {
                    // Here we will generate the jwt refresh token
                    const payload = {
                        'Result': 'This is a refresh token',
                    };
                    jwt.sign(payload, JWT_SECRET, {
                        algorithm: 'HS256',
                    }, function(err, token){
                        if(err){
                            // If there are any jwt errors
                            reject(err);
                        }
                        // If jwt refresh token was successfully generated
                        resolve([password_hash, token]);
                    });
                });
            }
        )
        .then(
            function([password_hash, refresh_token]){
                // Now here we are sending a query to the db to create the user
                // Deleted is given to be 0 on creation
                // uuid is also only created at the time for insert
                return new Promise((resolve, reject) => {
                    const user_id = uuid();
                    this.pool.query(`
                    INSERT INTO USERS
                    (user_id, username, password, avatar_icon_file_name, refresh_token, deleted)
                    values
                    (?, ?, ?, ?, ?, ?)
                    `, [user_id, username, password_hash, avatar_icon_file_name, refresh_token, 0], function(err, data){
                        if(err){
                            // If there are any MySQL errors
                            reject(err);
                        }
                        else{
                            // User is successfully created
                            resolve(data);
                        }
                    });
                });
            }.bind(this)
        );
    },
    // Get the user by the username from the db, returns the whole user
    getUserByUsername(username){
        return new Promise((resolve, reject) => {
            this.pool.query(`
            SELECT * FROM USERS
            WHERE username = ?
            `, [username], function(err, data){
                if(err){
                    // If there is SQL errors
                    return reject(err);
                }
                else if(data.length === 0){
                    const err = new Error('User does not exist');
                    err.code = 'USER_NOT_EXIST';
                    return reject(err);
                }
                else if(data.length > 1){
                    const err = new Error('Too many users');
                    err.code = 'MANY_USERS';
                    return reject(err);
                }
                return resolve(data[0]);
            });
        });
    },
    getUserByUserId(user_id){
        return new Promise((resolve, reject) => {
            this.pool.query(`
            SELECT * FROM USERS
            WHERE user_id = ? 
            `, [user_id], function(err, data){
                if(err){
                    // If there is SQL errors
                    return reject(err);
                }
                else if(data.length === 0){
                    const err = new Error('User does not exist');
                    err.code = 'USER_NOT_EXIST';
                    return reject(err);
                }
                else{
                    return resolve(data[0]);
                }
            });
        });
    },
    getUserByRefreshToken(refresh_token){
        return new Promise((resolve, reject) => {
            this.pool.query(`
            SELECT * FROM USERS
            WHERE refresh_token = ? 
            `, [refresh_token], function(err, data){
                if(err){
                    reject(err);
                }
                else if(data.length === 0){
                    const err = new Error('Invalid refresh token');
                    err.code = 'INVALID_TOKEN';
                    reject(err);
                }
                else{
                    resolve(data[0]);
                }
            });
        });
    },
    checkPassword(password, password_hash){
        return new Promise((resolve, reject) => {
            // Compares the two values
            bcrypt.compare(password, password_hash, function(err, same){
                if(err){
                    return reject(err);
                }
                // If there are no errs, returns bool if they are the same
                return resolve(same);
            });
        });
    }
};

module.exports = userDB;