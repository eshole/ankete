var express = require('express');
var router = express.Router();
var user = require('../controllers/userController'),
    predmet = require('../controllers/predmetController'),
    auth = require('../controllers/authController');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Anketa' });
});

router.get('/loginProf', function(req, res, next) {
  if (req.session.user) {
    req.session.views++;
    res.redirect('/main');
  }
  res.render('login', { title: 'Anketa' });
});

router.post('/loginProf',user.profLogin, user.predmeti, function(req, res, next) {
  req.session.user = res.uname;
  req.session.views = 1;
  req.session.predmeti = res.predmeti;
  console.log(req.session);
  res.render('profMain', { title: 'Anketa', predmeti: res.predmeti, predavac: req.session.user});
});

router.get('/mainProf/:id', auth.checkAuthentication, predmet.predavanja, function (req, res, next) {
  res.render('profPredmet', {
    title: res.predmet,
    pred: res.pred,
    predm: req.session.predmeti,
    predmetID: req.params.id,
    predavac: req.session.user});
});

router.get('/mainProf/dodajPredavanje/:predmet', auth.checkAuthentication, function(req, res, next) {
    res.render('insertPredavanje', {
      title: 'Dodaj predavanje',
      predmetID: req.params.predmet,
      predm: req.session.predmeti,
      predavac: req.session.user
    })
});

router.post('/mainProf/dodajPredavanje/:predmet', auth.checkAuthentication, predmet.dodajPredavanje, function(req, res, next) {
    res.redirect(`/mainProf/dodajPredavanje/${req.params.predmet}`);
});

router.get('/mainProf/predavanje/:sifra', auth.checkAuthentication, predmet.lekcija, predmet.pitanja, function(req, res, next) {
  res.render('predavanje', {
    lekcija: res.lekcija,
    pitanja: res.pitanja,
    predm: req.session.predmeti,
    predavac: req.session.user});
});

router.get('/mainProf/predavanje/aktiviraj/:sifra', auth.checkAuthentication, predmet.aktivirajPredavanje, function (req, res, next) {
  res.redirect(`/mainProf/predavanje/${req.params.sifra}`);
});

router.get('/regProf', function(req, res, next) {
  res.render('profRegistration', { title: 'Anketa' });
});

router.get('/main', auth.checkAuthentication, user.predmeti, function(req, res, next) {
  console.log(req.session.user);
  res.render('profMain', {
    title: 'Anketa',
    predmeti: req.session.predmeti,
    predavac: req.session.user
  });
});

router.get('/logout', function(req, res, next) {
  req.session.destroy(() => {
    console.log("Sesija unistena!");
  });
  res.render('login', {title: 'Odjava'});
});

router.post('/regFormProf', user.profCheck, (req, res, next) => {
  res.render('login', {title: "Login"});
});

module.exports = router;