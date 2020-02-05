var express = require('express');
var router = express.Router();
const pitanje = require('../controllers/pitanjeController'),
    auth = require('../controllers/authController');

router.get('/edit/:sifra/:id', auth.checkAuthentication, pitanje.editPitanje, pitanje.pitanjeInfo, function(req, res, next) {
    res.render('pitanje', {
        title: 'Uređivanje pitanja',
        odgovori: res.odg,
        predm: req.session.predmeti,
        predavac: req.session.user,
        sifraPredavanja: req.params.sifra,
        pitanjeID: req.params.id,
        pitanjeTip: req.pitanjeTip,
        pitanjeTekst: req.pitanjeTekst
    });
});

router.get('/delete/:sifra/:id', auth.checkAuthentication, pitanje.delPitanje, function(req, res, next) {
    res.redirect(`/mainProf/predavanje/${req.params.sifra}`);
});

router.get('/dodaj/:sifra', auth.checkAuthentication, function(req, res, next) {
    res.render('insertPitanje', {
        title: "Unos novog pitanja",
        predmeti: req.session.predmeti,
        sifraPredmeta: req.params.sifra
    });
});

router.post('/dodaj/:sifra', auth.checkAuthentication, pitanje.dodajPitanje, function(req, res, next) {
    res.redirect(`/mainProf/predavanje/${req.params.sifra}`);
});

router.get('/updateOdg/:sifra/:id', auth.checkAuthentication, pitanje.updateOdg, function(req, res, next) {
    //res.redirect(`/pitanje/edit/${req.params.sifra}/${req.params.id}`)
    res.sendStatus(200);
});

router.get('/insertOdg/:sifra', auth.checkAuthentication, pitanje.insertOdg, function(req, res, next) {
    //res.redirect(`/pitanje/edit/${req.params.sifra}/${req.body.id}`)
    res.sendStatus(200);
});

router.get('/aktiviraj/:id', auth.checkAuthentication, pitanje.aktiviraj, function(req, res, next) {
    //res.redirect(`/mainProf/predavanje/${req.body.sifra}`);
    res.sendStatus(200);
});

module.exports = router;