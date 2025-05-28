const validator = require('../helpers/validate');

const saveBook = (req, res, next) => {
  const validationRule = {
    title: 'required|string',
    author: 'required|string',
    publishedYear: 'required|year',
    genre: 'required|string',
    pages: 'required|integer',
    birthday: 'required|date',
    available: 'required|boolean'
  };

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    } else {
      next();
    }
  });
};

const saveAuthor = (req, res, next) => {
    const validationRule = {
      name: 'required|string',
      birthdate: 'required|date',
      nationality: 'required|string'
    };
  
    validator(req.body, validationRule, {}, (err, status) => {
      if (!status) {
        res.status(412).send({
          success: false,
          message: 'Validation for author failed',
          data: err
        });
      } else {
        next();
      }
    });
  };

module.exports = {
  saveBook,
  saveAuthor
}