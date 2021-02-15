require('dotenv').config();
const cors = require('cors');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const db = require('./dbConnection');
const middleware = require('./middlewares/index');
const fileupload = require("express-fileupload");

const app = express();

console.log("Node js running");

app.use(cors());
app.use(bodyParser.json({
    limit: '15mb'
}));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(fileupload({
    useTempFiles: true
}));
var swaggerJSDoc = require('swagger-jsdoc');
var swaggerUi = require('swagger-ui-express');

app.use(express.static(path.join(__dirname, 'public')));

dbConnect();


function dbConnect() {
    // Connect to mongo db
    db.connect()
        .then(() => {
            console.log("DB Connected");
            require('./routes/endpoints')(app);

            app.all('*', middleware.pageNotFound);
            app.listen(process.env.PORT);
        }).catch((error) => {
            console.log(error);
        });
}

// swagger definition
let swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: "PRDXN Assignment",
        version: '1.0.0',
        description: 'This document includes the all API endpoints of the Assignment.',
    },
    host: "http://" + process.env.HOST,
    basePath: '',
    schemes: ['http', 'https'],
    consumes: [
        "application/json",
        "application/xml"
    ],
    produces: [
        "application/json",
        "application/xml"
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                in: "header",
                name: "authorization",
                bearerFormat: "JWT"
            }
        }
    }
};
// options for the swagger docs
var options = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: ['./src/controllers/*'],
    // apis: ['./app/swagger.yaml'],

};

// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options);
app.use('/swagger.json', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

function validateModel(name, model) {
    const responseValidation = swaggerSpec.validateModel(name, model, false, true)
    if (!responseValidation.valid) {
        console.error(responseValidation.errors)
        throw new Error(`Model doesn't match Swagger contract`)
    }
}

// app.use('/api-docs', function (req, res) {
//     // console.log('res file', res.render);
//     res.render('./swagger/index.html');
//     // res.sendFile('./swagger/index.html');
// })

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection:', reason, '\n', 'At: ', new Date());

    let extra = {
        level: 2,
        error_stack: JSON.stringify(reason),
        error: 'unhandledRejection'
    };

});

module.exports = app;