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
    }
};

module.exports = listingsDB;