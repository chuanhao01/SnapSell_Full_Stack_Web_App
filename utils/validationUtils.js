// This utils file mainly contains:
// Utility functions for validation

const validationUtils = {
    checkEmpty(body){
        let values = Object.values(body);
        for(let value of values){
            if(value === ''){
                return true;
            }
        }
        return false;
    },
    checkNumber(field){
        // Returns true if it is a number and false otherwise
        return !isNaN(field);
    },
    checkPositive(field){
        return field > 0;
    }
};

module.exports = validationUtils;