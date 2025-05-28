const express = require('express');
const bodyParser = require('body-parser');

const mongodb = require('./data/database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const booksRoutes = require('./routes/index');
app.use('/books', booksRoutes);

// Conectar a MongoDB y luego iniciar el servidor
mongodb.initDb((err) => {
  if (err) {
    console.error(err);
  } else {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  }
});
