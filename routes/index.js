const router = require('express').Router();

// router.use('/', require('../swagger'));

const booksRoutes = require('./books');
const authorsRoutes = require('./authors');


router.get('/', (req, res) => {
    res.send('Root')
})

router.use('/books', booksRoutes)
router.use('/authors', authorsRoutes);

module.exports = router;