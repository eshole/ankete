const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PSW,
    port: 5432
};
var pg = require('pg'),
    pool = pg.Pool(config);

module.exports.getPitanja = function (req, res, next) {
    if (req.body.sifraPredmeta.length != 7) {
        res.render('student', {title: 'Student', message: 'Neispravan kod'});
    }
    pool.connect((err, client, done) => {
        if (err) {
            console.log(err);
        }

        client.query('SELECT * FROM predavanje WHERE sifra = $1', [req.body.sifraPredmeta], (error, ress) => {
            done();

            if (error) {
                console.error(error);
            } else {
                if (ress.rows.length === 0) {
                    res.render('student', {title: 'Student', message: 'Neispravan kod'});
                } else {
                    if (!(ress.rows[0].aktivno)) {
                        res.render('student', {title: 'Student', message: 'Anketa nije pokrenuta'});
                    } else {
                        next();
                    }
                }
            }
        })
    })
};