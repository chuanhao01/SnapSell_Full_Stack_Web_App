// This file contains controllers pertaining to:
// Everything that has to deal with error pages

const errorController = {
    init(app){
        const parentDir = 'pages/error/';
        app.get('/error/403', function(req, res){
            res.render(parentDir + '403', {
                'title': '403 error',
            });
        });
    }
};

module.exports = errorController;