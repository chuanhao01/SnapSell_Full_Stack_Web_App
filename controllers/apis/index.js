// This is the main file that contains all the api controllers so that it can be easily impoerted

// Importing other API controllers
const accountAPIController = require('./accountAPIController');
const assignmentAPI = require('./assignmentAPI');

const APIControllers = {
    init(app){
        accountAPIController.init(app);
        assignmentAPI.init(app);
    }
};

module.exports = APIControllers;
