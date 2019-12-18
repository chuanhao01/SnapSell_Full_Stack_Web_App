// This db file contains:
// Actions pertaining to interacting with the USERS db or interacts with a 'user'

// Importing other libs I need to use
const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 13;

const userDB = {
    init(pool){
        this.pool = pool;
    },
    // Main function for actions in the db below
    createANewUser(avatar_icon_file_name, username, password){
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
                        return resolve(true);
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