// Bring Mongoose into the app
var mongoose = require('mongoose');
var conf = require("../config");
// Build the connection string
var dbURI = "mongodb://"+conf.get("database:user")+":"+conf.get("database:password")+"@stopsmoking-shard-00-00-fz7nq.mongodb.net:27017,stopsmoking-shard-00-01-fz7nq.mongodb.net:27017,stopsmoking-shard-00-02-fz7nq.mongodb.net:27017/"+conf.get("database:name")+"?ssl=true&replicaSet=StopSmoking-shard-0&authSource=admin";
//var dbURI = "mongodb://localhost/stopsmoking";
// Create the database connection
mongoose.connect(dbURI);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open to ' + dbURI);
  console.log('Collections: ')
  mongoose.connection.db.listCollections().toArray(function(err, names) {
    if (err) {
        console.log(err);
    }
    else {
        names.forEach(function(e,i,a) {
            console.log("--->>", e.name);
        });
    }
});
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
  console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});
