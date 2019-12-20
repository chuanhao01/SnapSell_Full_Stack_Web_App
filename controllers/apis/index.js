// This is the main file that contains all the api controllers so that it can be easily impoerted

// Importing other API controllers
const accountAPIController = require('./accountAPIController');
const assignmentAPIController = require('./assignmentAPIController');

const APIControllers = {
    init(app){
        accountAPIController.init(app);
        assignmentAPIController.init(app);
    }
};

module.exports = APIControllers;
