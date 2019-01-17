//express is the framework we're going to use to handle requests
const express = require('express');
//Create a new instance of express
const app = express();
var cors = require('cors');
app.use(cors());
const bodyParser = require("body-parser");
//This allows parsing of the body of POST requests, that are encoded in JSON
app.use(bodyParser.json());

//pg-promise is a postgres library that uses javascript promises
const pgp = require('pg-promise')();
//We have to set ssl usage to true for Heroku to accept our connection
pgp.pg.defaults.ssl = true;

//Create connection to Heroku Database
let db = pgp(process.env.DATABASE_URL);

app.use('/get-members',             require('./routes/get-members.js'));
app.use('/get-balance',             require('./routes/get-balance.js'));
app.use('/set-balance',             require('./routes/set-balance.js'));
app.use('/get-wallet',              require('./routes/get-wallet.js'));
app.use('/get-transfers',           require('./routes/get-transfers.js'));
app.use('/make-out-bound-transfer', require('./routes/make-out-bound-transfer.js'));
app.use('/get-transactions',        require('./routes/get-transactions.js'));
app.use('/get-open-orders',         require('./routes/get-open-orders.js'));
app.use('/create-order',            require('./routes/create-order.js'));
app.use('/buy',                     require('./routes/buy.js'));
app.use('/get-recipients',          require('./routes/get-recipients.js'));
app.use('/admin-get-stats',         require('./routes/admin-get-stats.js'));
app.use('/get-crypto-data',         require('./routes/get-crypto-data.js'));

/*
* Heroku will assign a port you can use via the 'PORT' environment variable
* To accesss an environment variable, use process.env.<ENV>
* If there isn't an environment variable, process.env.PORT will be null (or undefined)
* If a value is 'falsy', i.e. null or undefined, javascript will evaluate the rest of the 'or'
* In this case, we assign the port to be 5000 if the PORT variable isn't set
* You can consider 'let port = process.env.PORT || 5000' to be equivalent to:
* let port; = process.env.PORT;
* if(port == null) {port = 5000}
*/
app.listen(process.env.PORT || 5000, () => {
    console.log("Server up and running on port: " + (process.env.PORT || 5000));
});
