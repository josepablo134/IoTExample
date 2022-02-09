'use strict';

const router = require('express').Router();

const services= require('./services/services.js');

router.get('/greeting/:name', services.getGreeting);

module.exports = router;
