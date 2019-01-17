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
get-balance
input: userID
post: Returns the balance of userID
*/

router.post('/', (req, res) => {
   const userID = req.body['User_ID'] // USER

   // Returns the balance of USER based on the userID
   db.any('SELECT Balance FROM Bank WHERE User_ID = $1', [userID])
    .then(rows=>{
        if (rows.length === 0) { // If no records to return, break
            res.send({
                success:false
            })
        } else { // If some records were returned, returns such records
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
