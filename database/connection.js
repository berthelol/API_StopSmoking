// Bring Mongoose into the app
var mongoose = require('mongoose');
var conf = require("../config");
// Build the connection string
var dbURI = 'mongodb://localhost/'+conf.get("database:name");

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
