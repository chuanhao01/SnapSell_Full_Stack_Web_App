// This file contains controllers pertaining to:
// Home pages, those that are attached to / or similar

const homeController = {
    // Function to call to intialise all routes and controlers
    init(app){
        const parentDir = 'pages/home/';
        app.get('/', function(req, res){
            res.render(parentDir + 'homeLandingPage', {
                'title': 'SnapSell Home page',
            });
        });
        app.get('/random', function(req, res){
            res.render(parentDir + 'homeLandingPage', {
                'title': 'SnapSell Home page',
            });
        });
    }
};

module.exports = homeController;