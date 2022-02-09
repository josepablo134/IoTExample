"use strict";

function getGreeting(req, res) {
    const { name } = req.params;
    return res.status(200).send(`Hello ${name}`);
}

module.exports = { getGreeting };
