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
get-recipient
input: userID
post: return all users except userID
*/

router.post('/', (req, res) => {
    const userID = req.body['User_ID'] // Transferer

    // Returns all users except for the Transferer
    db.any('SELECT * FROM User_Info WHERE User_ID != $1', [userID]).then(rows=>{
        if (rows.length === 0) {
            res.send({success:false})
        } else {
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
