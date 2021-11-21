// Database setup module
var mongoose = require('mongoose');
const { DB_CONN_URI } = process.env;
require('./record');

const DB_URI = DB_CONN_URI;


if(DB_URI){
    mongoose.connect(DB_URI, 
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    );
}


mongoose.connection.on('connected', () => {
    //console.log("Connected the database located at " + DB_URI);
});
mongoose.connection.on('error', (err) => {
    //console.log("Error while connecting to database located at " + DB_URI + ' Error Message: ' + err);
});
mongoose.connection.on('disconnected', () => {
    //console.log("Disconnected from " + DB_URI);
});

closeConnection = (msg, callback) => {
    mongoose.connection.close(() => {
        //console.log('Mongoose closed\n' + msg);
        callback();
    });
};

/*
    When the app closed, the database connections should be closed as well
    in this situation, there are 3 scenarios, in localhost: nodemon or
    npm, in cloud: Heroku or Netlify. All of these should be handled 
    seperately, because of the instances and process IDs. The processes
    should be killed. Below block contains these operations.
*/

// When nodemon closed
process.once('SIGUSR2', () => {
    closeConnection('nodemon closed\n', () => {
        process.kill(process.pid, 'SIGUSR2');
    });
});

//When app closed
process.once('SIGINT', () => {
    closeConnection('Application closed\n', () => {
        process.exit(0);
    });
});

// When deployed Heroku app closed
process.once('SIGTERM', () => {
    closeConnection('Heroku closed\n', () => {
        process.exit(0);
    });
});
