// Importing the other controllers in the folder
const homeController = require('./homeController');
const accountController = require('./accountController');
const errorController = require('./errorController');
const userController = require('./userController');

const accountAPIController = require('./apis/accountAPIController');

// Creating the main exported controller object
const controllers = {
    init(app){
        homeController.init(app);
        accountController.init(app);
        errorController.init(app);
        userController.init(app);

        accountAPIController.init(app);
    }
};

module.exports = controllers;