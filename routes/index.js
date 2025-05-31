const router = require('express').Router();

// router.use('/', require('../swagger'));

const booksRoutes = require('./books');
const authorsRoutes = require('./authors');
const passport = require('passport');


// router.get('/', (req, res) => {
//     res.send('Root')
// })

router.get("/login", passport.authenticate("github"), (req, res) => {} );

router.get("/logout", function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect("/");
    });
});

router.use('/books', booksRoutes)
router.use('/authors', authorsRoutes);

module.exports = router;