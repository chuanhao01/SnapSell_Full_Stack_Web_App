// This db file contains:
// Actions pertaining to interacting with the USERS db or interacts with a 'user'

// Importing other libs I need to use
const uuid = require('uuid/v4');

const userDB = {
    init(pool){
        this.pool = pool;
    },
    // Main function for actions in the db below
    createANewUser(avatar_icon_file_name, username, password){
        return new Promise((resolve, reject) => {
            
        });
    }
};

module.exports = userDB;