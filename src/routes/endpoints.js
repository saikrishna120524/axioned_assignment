'use strict';
const middleware = require('../middlewares/index');

const battlesController = require('../controllers/battlesController');

module.exports = (app) => {

    app.get('/prdxn/health-check', function(req, res) {
        return res.status(200).end('ok');
    });

    app.get('/', function(req, res) {
        res.status(200).end('Welcome To PRDXN!!!');
    });

    app.route('/list')
        .get(battlesController.getBattlesList)
        .all(middleware.methodNotAllowed);

    app.route('/count')
        .get(battlesController.getBattlesCount)
        .all(middleware.methodNotAllowed);

    app.route('/stats')
        .get(battlesController.battlesStats)
        .all(middleware.methodNotAllowed);

    app.route('/search')
        .get(battlesController.battlesSearch)
        .all(middleware.methodNotAllowed);
};