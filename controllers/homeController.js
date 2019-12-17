const homeController = {
    // Function to call to intialise all routes and controlers
    init(app){
        const parentDir = 'pages/home/';
        app.get('/', function(req, res){
            res.render(parentDir + 'homeLandingPage', {
                'title': 'SnapSell Home page',
            });
        });
    }
};

module.exports = homeController;