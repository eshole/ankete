var express = require('express');
var router = express.Router();
var studenti = require('../controllers/studentController'),
    auth = require('../controllers/authController'),
    pitanje = require('../controllers/pitanjeController');

router.get('/', function(req, res, next) {
    res.render('student', {title: 'Student', message: 'Dobrodošli na anketiranje'});
});

router.post('/anketa', auth.studentAuth, studenti.getPitanja, function(req, res, next) {
    res.redirect(`/student/kviz/${req.body.sifraPredmeta}`);
});

router.get('/kviz/:sifra', auth.studentAuth, pitanje.dajAktivno, pitanje.dajOdgovore, function (req, res, next) {
    var message = res.pitanje.tekst;
    res.render('kviz', {
        title: 'Kviz',
        pitanje: res.pitanje,
        odgovori: res.odgovori,
        message: message});
});

router.post('/odgovor/:id', auth.studentAuth, pitanje.odgovor, function (req, res, next) {
res.redirect(`/student/kviz/${req.params.sifra}`);
});

module.exports = router;