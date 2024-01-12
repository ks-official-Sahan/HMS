const express = require('express');

/* routes */
const cors = require('cors');
const users = require('../routes/users');
const admins = require('../routes/admins');
const auth = require('../routes/auth');
const statics = require('../routes/statics');
const leaves = require('../routes/leaves');
const claims = require('../routes/claims');
const status = require('../routes/status');
const notifications = require('../routes/notifications');

/* custom middlewares */
const error = require('../middleware/error');

module.exports = function (app) {
    /* middleware */
    app.use(express.json());
    app.use(cors({
        origin: '*'
    }))

    /* custom middleware */
    app.use(error);

    /* route management */
    app.use('/api/users', users);
    app.use('/api/admins', admins);
    app.use('/api/auth', auth);
    app.use('/api/statics', statics);
    app.use('/api/leaves', leaves);
    app.use('/api/claims', claims);
    app.use('/api/status', status);
    app.use('/api/notifications', notifications);

}