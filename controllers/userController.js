const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PSW,
    port: 5432
};
var pg = require('pg'),
    pool = pg.Pool(config),
    bcrypt = require('bcrypt');

//webinode
//programiranjeII
//algoritmi

module.exports.profCheck = function(req, res, next) {
    bcrypt.hash(req.body.psw, 10, (error, result) => {
        if (error) console.log("Belaj!");
        pool.connect((err, client, done) => {
            if (err) throw err;

            client.query('INSERT INTO predavaci (username, email, pass) values ($1, $2, $3)',
                [req.body.uname, req.body.mail, result], (err, r) => {
                done();
                if (err) {
                    console.log("Predavač već postoji u bazi");
                    res.sendStatus(412);
                } else {
                    next();
                }
            });
        });
    });
};

module.exports.profLogin = function(req, res, next) {
  pool.connect((err, client, done) => {
      if (err) {
          res.sendStatus(500);
      }

      client.query('SELECT * FROM predavaci WHERE username = $1',
          [req.body.uname], (err, result) => {
          done();
          if (err) {
              alert("Neispravni podaci");
          } else {
              if (result.rows.length > 1) {
                  console.error("Neispravan unos!");
              }
              bcrypt.compare(req.body.psw, result.rows[0].pass, (err, rez) => {
                  if (err) console.log("Ne poklapa se!");
                  if (rez) {
                      res.uname = req.body.uname;
                      next();
                  } else {
                      console.log("Ne poklapa se 2!");
                  }
              })
          }
      });
  })
};

module.exports.predmeti = function(req, res, next) {
    pool.connect((err, client, done) => {
        if (err) {
            res.sendStatus(500);
        }
        client.query("SELECT p.id, p.naziv FROM predmet p INNER JOIN predavaci pr ON pr.id = p.predavac and pr.username = $1",
            [res.uname], (error, ress) => {
            done();

            if (error) {
                res.send("Error");
            } else {
                res.predmeti = ress.rows;
                next();
            }
        });
    });
};
