"use strict";

var nconf = require('nconf');

// Defaults.
nconf.defaults({
    // Si on veut désactiver l'authentification des routes et des sockets
    authentication: {
        round: 4,
        secret: "StopSmokingBitch"
    },
    // variables du serveur
    server: {
        port: 3000,
    },
    // Variables pour configurer mysql
    database: {
        host: '127.0.0.1',
        port: 27017,
        name: 'stopsmoking',
        user: '',
        password: ''
    }
});

module.exports = nconf;
