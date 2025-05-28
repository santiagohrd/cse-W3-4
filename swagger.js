const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Library Api',
        description: 'API for managing books and authors'
    },
    host: 'localhost:3000',
    schemes: ['https', 'http']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);