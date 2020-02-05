const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PSW,
    port: process.env.DB_PORT
};
var pg = require('pg'),
    pool = pg.Pool(config);

function daneOdg(id) {
    pool.connect((err, client, done) => {
        if (err) {
            console.error(err);
        }
        console.log(id);
        client.query('INSERT INTO odgovor (value, tacan, pitanje_id) VALUES (\'DA\', true, $1), (\'NE\', false, $1)', [id], (error, ress) => {
            done();
            if (error) {
                console.error(error);
            }
        });
    });
}

module.exports.delPitanje = function(req, res, next) {
    pool.connect((err, client, done) => {
        if (err) {
            console.error(err);
        }

        client.query('DELETE FROM pitanje WHERE id = $1', [req.params.id], (error, ress) => {
            done();
            if (error) {
                console.error(error);
            } else {
                console.log(req.params.sifra);
                next();
            }
        })
    })
};

module.exports.editPitanje = function(req, res, next) {
    pool.connect((err, client, done) => {
        if (err) {
            console.error(err);
        }

        client.query('SELECT o.id as oid, value, tacan, p.id as pid, tip, tekst FROM odgovor o INNER JOIN pitanje p ' +
            'ON o.pitanje_id = p.id AND p.id = $1;', [req.params.id], (error, ress) => {
            done();
            if (error) {
                console.error(error);
            } else {
                res.odg = ress.rows;
                next();
            }
        })
    })
};

module.exports.dodajPitanje = function (req, res, next) {
    pool.connect((err, client, done) => {
        if (err) {
            console.error(err);
        }

        client.query("INSERT INTO pitanje (tip, tekst, predavanje_id) VALUES ($1, $2, $3)",
            [req.body.tipPitanja, req.body.tekstPitanja, req.params.sifra], (error, ress) => {
                if (error) {
                    console.error(error);
                }
            });

        client.query("SELECT max(id) FROM pitanje", (error, ress) => {
            done();

            if (error) {
                console.error(error);
            } else {
                res.sifraPitanja = ress.rows[0].max;
                if (req.body.tipPitanja == 1) {
                    daneOdg(res.sifraPitanja);
                }
                next();
            }
        });
    });
};

module.exports.pitanjeInfo = function(req, res, next) {
    pool.connect((err, client, done) => {
        if (err) {
            console.error(err);
        }
        client.query('SELECT tip, tekst FROM pitanje WHERE id = $1', [req.params.id], (error, ress) => {
            done();
            if (error) {
                console.error(error);
            } else {
                req.pitanjeTip = ress.rows[0].tip;
                req.pitanjeTekst = ress.rows[0].tekst;
                next();
            }
        });
    });
};

module.exports.updateOdg = function (req, res, next) {
    pool.connect((err, client, done) => {
        if (err) {
            console.error(err);
        }
        console.log(req.query);
        client.query("UPDATE odgovor SET value = $1, tacan = $2 WHERE id = $3",
            [req.query.odg, req.query.tacan, req.params.id], (error, ress) => {
                done();
                if (error) {
                    console.error(error);
                } else {
                    next();
                }
            });
    });
};

module.exports.insertOdg = function(req, res, next) {
    pool.connect((err, client, done) => {
        if (err) {
            console.error(err);
        }
        console.log(req.query);
        client.query('INSERT INTO odgovor (value, pitanje_id) VALUES ($1, cast($2 as int))',
            [req.query.odg, req.query.id], (error, ress) => {
            done();
            if (error) {
                console.error(error);
            } else {
                next();
            }
        });
    });
};

module.exports.aktiviraj = function(req, res, next) {
    pool.connect((err, client, done) => {
        if (err) {
            console.error(err);
        }
        client.query('UPDATE pitanje SET aktivirano = not aktivirano WHERE id = $1',
            [req.params.id], (error, ress) => {
                done();
                if (error) {
                    console.error(error);
                } else {
                    next();
                }
            });
    });
};

module.exports.dajAktivno = function (req, res, next) {
    pool.connect((err, client, done) => {
        if (err) {
            console.error(err);
        }
        client.query('SELECT * FROM pitanje p INNER JOIN predavanje pr ON ' +
            'p.predavanje_id = pr.sifra AND pr.sifra = $1 AND p.aktivirano = true',
            [req.params.sifra], (error, ress) => {
                done();
                if (error) {
                    console.error(error);
                } else {
                    if (ress.rows.length === 0) {
                        console.log('nema pitanja');
                        res.render('kviz', {title: 'Kviz', message: 'Standby'});
                    } else {
                        res.pitanje = ress.rows[0];
                        next();
                    }
                }
            });
    });
};

module.exports.dajOdgovore = function (req, res, next) {
    pool.connect((err, client, done) => {
        if (err) {
            console.error(err);
        }
        client.query('SELECT * FROM odgovor WHERE pitanje_id = $1',
            [res.pitanje.id], (error, ress) => {
                done();
                if (error) {
                    console.error(error);
                } else {
                    res.odgovori = ress.rows;
                    next();
                }
            });
    });
};

module.exports.odgovor = function (req, res, next) {
pool.connect((err, client, done) => {
    if (err) {
        console.error(err);
    }

    client.query('INSERT INTO student_odgovor (student, odgovor, )')

})
};