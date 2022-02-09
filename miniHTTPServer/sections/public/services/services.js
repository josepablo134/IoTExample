"use strict";

function getGreeting(req, res) {
    const { name } = req.params;
    return res.status(200).send({
        msg: `Hello ${name}`,
        code: 400,
    });
}

module.exports = { getGreeting };
