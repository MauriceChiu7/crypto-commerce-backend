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
get-members
post: return all users in User_Info
*/

router.post('/', (req, res) => {

    // Returns all users in User_Info
    db.any('SELECT * FROM User_Info').then(rows=>{
        if (rows.length === 0) { // If no records to return, break
            res.send({success:false})
        } else { // If some records were returned, return such records
            res.send({
                success:true,
                rows:rows
            })
        }
    }).catch(()=>{
        res.send({success:false})
    })
});
module.exports = router;
