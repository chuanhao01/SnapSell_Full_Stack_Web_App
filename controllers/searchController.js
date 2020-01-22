// This file contains controllers pertaining to:
// To the get of the search page

const searchController = {
    init(app){
        const parent_dir = 'pages/search/';
        app.get('/search', function(req, res){
            res.render(parent_dir + 'searchPage', {
                'title': 'Searching for something'
            });
        });
    }
};

module.exports = searchController;