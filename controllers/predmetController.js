const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PSW,
    port: process.env.DB_PORT
};
var pg = require('pg'),
    pool = pg.Pool(config);
var rs = require('randomstring');

module.exports.predavanja = function(req, res, next) {
    pool.connect((err, client, done) => {
        if (err) {
            console.error(err);
        }

        client.query('SELECT pr.sifra, pr.broj, pr.naziv, p.naziv as naz ' +
            'FROM predavanje pr INNER JOIN predmet p on pr.predmet_id = p.id and predmet_id = $1;',
            [req.params.id], (err, ress) => {
                done();
                if (err) {
                    console.error(err)
                } else {
                    for (var i=0; i<req.session.predmeti.length; i++) {
                        if (req.session.predmeti[i].id == req.params.id) {
                            res.predmet = req.session.predmeti[i].naziv;
                        }
                    }
                    res.pred = ress.rows;
                    next();
                }
            });
    });
};

module.exports.lekcija = function (req, res, next) {
    pool.connect((err, client, done) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        }

        client.query('SELECT * FROM predavanje WHERE sifra = $1', [req.params.sifra], (error, ress) => {
            done();
            if (error) {
                console.error(error);
            } else {
                res.lekcija = ress.rows;
                next();
            }
        });
    });
};

module.exports.pitanja = function(req, res, next) {
    pool.connect((err, client, done) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        }

        client.query('SELECT * FROM pitanje WHERE predavanje_id = $1', [req.params.sifra], (error, ress) => {
            done();

            if (error) {
                console.error(error);
            } else {
                res.pitanja = ress.rows;
                next();
            }
        })
    })
};

module.exports.dodajPredavanje = function(req, res, next) {
    var sifra = rs.generate({
        length: 7,
        charset: 'alphabetic',
        capitalization: 'uppercase'
    });
    pool.connect((err, client, done) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        }

        client.query('INSERT INTO predavanje (sifra, broj, predmet_id, naziv, aktivno) VALUES ' +
            '($1, $2, $3, $4, false)', [sifra, req.body.redniBroj, req.params.predmet, req.body.naziv], (error, ress) => {
            done();
            if (error) {
                console.error(error);
            } else {
                next();
            }
        });
    });
};

module.exports.aktivirajPredavanje = function (req, res, next) {
    pool.connect((err, client, done) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        }

        client.query('UPDATE predavanje SET aktivno = not aktivno WHERE sifra = $1', [req.params.sifra], (error, ress) => {
            done();
            if (error) {
                console.error(error);
            } else {
                next();
            }
        });
    });
};