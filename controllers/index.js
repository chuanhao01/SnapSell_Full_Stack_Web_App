// Importing the other controllers in the folder
const homeController = require('./homeController');
const accountController = require('./accountController');
const accountAPIController = require('./apis/accountAPIController');
const errorController = require('./errorController');

// Creating the main exported controller object
const controllers = {
    init(app){
        homeController.init(app);
        accountController.init(app);
        accountAPIController.init(app);
        errorController.init(app);
    }
};

module.exports = controllers;