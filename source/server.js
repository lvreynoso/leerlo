'use strict'

// environment setup
import dotenv from 'dotenv'
const result = (process.env.NODE_ENV == 'development') ? dotenv.config() : false

// dependencies
import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import handlebars from 'express-handlebars'

// routers
import index from './routers/index.js'

// handlebars helpers
import exphbsConfig from '../views/config/exphbs-config.js'
const exphbs = handlebars.create(exphbsConfig);

// set our express options
const app = express();
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.engine('handlebars', exphbs.engine);
app.set('view engine', 'handlebars');
app.use(express.static('public'));

// routes
app.use('/', index)

// face the world
const hotPort = app.get('port')
const server = app.listen(hotPort, () => {
    console.log(`App listening on port ${hotPort}!`)
})

// for Mocha/Chai test purposes
export default server;
