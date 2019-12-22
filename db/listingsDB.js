// This db file contains:
// Actions required on a listing, such as CRUD

// Importing other libs I need to use
const uuid = require('uuid/v4');

const listingsDB = {
    init(pool){
        this.pool = pool;
    },
    createANewListing(title, description, price, listing_user_id){
        return new Promise((resolve, reject) => {
            const listing_id = uuid();
            // Here availability and delted defaults to 0
            // Mapping of values can be seen in the markdown
            this.pool.query(`
            INSERT INTO LISTINGS
            (listing_id, title, description, price, listing_user_id, availability, deleted)
            VALUES
            (?, ?, ?, ?, ?, ?, ?)
            `, [listing_id, title, description, price, listing_user_id, 0, 0], function(err, data){
                if(err){
                    reject(err);
                }
                else{
                    resolve(data);
                }
            });
        });
    },
    getUserListings(listing_user_id){
        return new Promise((resolve, reject) => {
            this.pool.query(`
            SELECT * FROM LISTINGS
            WHERE ((listing_user_id = ?) AND (deleted = 0))
            `, [listing_user_id], function(err, data){
                if(err){
                    reject(err);
                }
                else{
                    resolve(data);
                }
            });
        });
    },
    checkIfUserListing(listing_id, listing_user_id){
        return new Promise((resolve, reject) => {
            this.pool.query(`
            SELECT * FROM LISTINGS
            WHERE ((listing_id = ?) AND (listing_user_id = ?) AND (deleted = 0)) 
            `, [listing_id, listing_user_id], function(err, data){
                if(err){
                    reject(err);
                }
                else if(data.length === 0){
                    const err = new Error('Listing does not belong to user');
                    err.code = 'USER_UNAUTH_LISTING';
                    reject(err);
                }
                else{
                    // If the user does have access to the listing
                    resolve(true);
                }
            });
        });
    },
    deleteAListing(listing_id){
        return new Promise((resolve, reject) => {
            this.pool.query(`
            UPDATE LISTINGS
            SET deleted = 1
            WHERE listing_id = ?
            `, [listing_id], function(err, data){
                if(err){
                    reject(err);
                }
                else{
                    resolve(data);
                }
            });
        });
    }
};

module.exports = listingsDB;