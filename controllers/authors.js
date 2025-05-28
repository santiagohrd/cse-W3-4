const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
  try {
      const authors = await mongodb.getDatabase().collection('authors').find().toArray();
      res.status(200).json(authors);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};

const getSingle = async (req, res) => {
  try {
      if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json('Must use a valid author id to find a author.');
      }
      const authorId = new ObjectId(req.params.id);
      const author = await mongodb.getDatabase().collection('authors').findOne({ _id: authorId });
      if (!author) {
        return res.status(404).json('Author not found');
      }
      res.status(200).json(author);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};

const createAuthor = async (req, res) => {
  try {
      const author = {
        name: req.body.name,
        nationality: req.body.nationality,
        birthyear: req.body.birthyear
      };
  
      const response = await mongodb.getDatabase().collection('authors').insertOne(author);
      if (response.acknowledged) {
        res.status(201).json({ message: 'Author created successfully', id: response.insertedId });
      } else {
        res.status(500).json(response.error || 'Some error occurred while creating the author.');
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};

const updateAuthor = async (req, res) => {
  //#swagger.tags=['Authors']
  if (!ObjectId.isValid(req.params.id)) {
      res.status(400).json('Must use a valid contact id to update an author.');
    }
  const authorId = new ObjectId(req.params.id);
  const author = {
    name: req.body.name,
    nationality: req.body.nationality,
    birthyear: req.body.birthyear
  };

  const response = await mongodb.getDatabase().collection('authors').replaceOne({_id: authorId}, author);
  if (response.modifiedCount > 0) {
      res.status(204).send();
  } else {
      res.status(500).json(response.error || 'Some error occurred while updating the author.');
  }
};

const deleteAuthor = async (req, res) => {
  //#swagger.tags=['Authors']
  if (!ObjectId.isValid(req.params.id)) {
      res.status(400).json('Must use a valid contact id to delete an author.');
    }
  const authorId = new ObjectId(req.params.id);

  const response = await mongodb.getDatabase().collection('authors').deleteOne({_id: authorId});
  if (response.deletedCount > 0) {
      res.status(204).send();
  } else {
      res.status(500).json(response.error || 'Some error occurred while deleting the author.');
  }
};

module.exports = {
  getAll,
  getSingle,
  createAuthor,
  updateAuthor,
  deleteAuthor
};
