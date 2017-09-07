"use strict";

var nconf = require('nconf');

// Defaults.
nconf.defaults({
    // Si on veut désactiver l'authentification des routes et des sockets
    authentication: {
        round: 4,
        secret: "StopSmokingBitch",
        salt:8
    },
    // variables du serveur
    server: {
        port: 3000,
    },
    // Variables pour configurer Nosql
    /*database: {
        host: '127.0.0.1',
        port: 27017,
        name: 'stopsmoking',
        user: '',
        password: ''
    },*/
    database: {
        port: 27017,
        name: 'StopSmoking',
        user: 'louc',
        password: '4249brazil4249',
        secondary1:"stopsmoking-shard-00-00-fz7nq.mongodb.net",
        secondary2:"stopsmoking-shard-00-02-fz7nq.mongodb.net",
        primary:"stopsmoking-shard-00-01-fz7nq.mongodb.net"
    }
});

module.exports = nconf;
