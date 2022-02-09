'use strict';

const router = require('express').Router();
const publicRoute = require('./public/routes.js');

router.use( '/public' , publicRoute );

module.exports = router;
