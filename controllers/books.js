const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
  try {
    const books = await mongodb.getDatabase().collection('books').find().toArray();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSingle = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json('Must use a valid book id to find a book.');
    }
    const bookId = new ObjectId(req.params.id);
    const book = await mongodb.getDatabase().collection('books').findOne({ _id: bookId });
    if (!book) {
      return res.status(404).json('Book not found');
    }
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createBook = async (req, res) => {
  try {
    const book = {
      title: req.body.title,
      author: req.body.author,
      publishedYear: req.body.publishedYear,
      genre: req.body.genre,
      pages: req.body.pages,
      language: req.body.language,
      available: req.body.available,
    };

    const response = await mongodb.getDatabase().collection('books').insertOne(book);
    if (response.acknowledged) {
      res.status(201).json({ message: 'Book created successfully', id: response.insertedId });
    } else {
      res.status(500).json(response.error || 'Some error occurred while creating the book.');
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAll,
  getSingle,
  createBook,
};
