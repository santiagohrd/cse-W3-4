const router = require('express').Router();

// router.use('/', require('./swagger'));

const booksController = require('../controllers/books');

router.get('/', booksController.getAll);
router.get('/', booksController.getSingle);

router.post('/', booksController.createBook);


module.exports = router;