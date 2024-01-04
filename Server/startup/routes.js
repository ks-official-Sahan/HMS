const express = require('express');

/* routes */
const users = require('../routes/users');
const admins = require('../routes/admins');
const auth = require('../routes/auth');
const statics = require('../routes/statics');

/* custom middlewares */
const error = require('../middleware/error');

module.exports = function (app) {
    /* middleware */
    app.use(express.json());

    /* route management */
    app.use('/api/users', users);
    app.use('/api/admins', admins);
    app.use('/api/auth', auth);
    app.use('/api/statics', statics);

    /* custom middleware */
    app.use(error);
}