// Importing the other controllers in the folder
const homeController = require('./homeController');

// Creating the main exported controller object
const controllers = {
    init(app){
        homeController.init(app);
    }
};

module.exports = controllers;