//express is the framework we're going to use to handle requests
const express = require('express');

//Create connection to Heroku Database
let db = require('../utilities/utils').db;
let getHash = require('../utilities/utils').getHash;
var router = express.Router();
const bodyParser = require("body-parser");
const crypto = require("crypto");
//This allows parsing of the body of POST requests, that are encoded in JSON
router.use(bodyParser.json());

/*
get-crypto-data
post: Returns all records in Crypto_Data
*/

router.post('/', (req, res) => {

    // Return all records in Crypto_Data
    db.any('SELECT * FROM Crypto_Data').then(rows=>{
        res.send({
            success:true,
            rows:rows
        })
    }).catch(()=>{
        res.send({success:false})
    })

});
module.exports = router;
