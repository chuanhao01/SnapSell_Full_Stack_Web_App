// This file is for all the API end points required in the BED CA1 Assignment 2019
// In this file there might be some repeats from the other files

/*
Name: Lim CHuan Hao
Class: DIT/FT/1B/11
Admin number: 19222764
*/

const assignmentDB = {
    init(pool){
        this.pool = pool;
    },
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
    postUsers(){
        
    }
};

module.exports = assignmentDB;