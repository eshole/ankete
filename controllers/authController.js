const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PSW,
    port: process.env.DB_PORT
};
var pg = require('pg'),
    pool = pg.Pool(config);

module.exports.checkAuthentication = function(req, res, next) {
    if (req.session.user) {
        req.session.views++;
    } else {
        res.render('login', {title: 'Neovlašteni pristup'});
    }
    next();
};

module.exports.studentAuth = function(req, res, next) {
    if (req.session.user) {
        res.render('student', {title: 'Student', message: 'Nije za predavače!'});
    } else {
        req.session.student = req.body.nick;
        next();
    }
};