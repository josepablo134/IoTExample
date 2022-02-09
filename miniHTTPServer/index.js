'use strict';
const express = require('express');
require('dotenv').config();

const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const sections = require('./sections/sections.js');
const middleWares = require('./utils/Middlewares.js');

const app = express();
const serverPort = process.env.SERVER_PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(cors({
  	origin: '*',
  	methods: [
    	'GET',
    	'POST',
		'PATCH',
    	'PUT',
    	'DELETE'
  	],
  		allowedHeaders: ['Content-Type', 'Authorization']
	}));

app.use( middleWares.errorJSON );

app.get( "/", (req,res) => { res.status(200).send("Hello world!"); } )

//app.use( middleWares.apiKey );

app.use( sections );

app.use( middleWares.error404 );

app.listen( serverPort , function(err){
	if( !err ){
		console.log('API listen on port', serverPort );
	}else{
		console.log( err );
	}
});
