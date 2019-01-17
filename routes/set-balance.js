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
set-balance
input: userID, newBalance
post: update (replace) the userID's balance to a non-negative amount
*/

router.post('/', (req, res) => {
    const userID = req.body['User_ID'] // USER
    const newBalance = req.body['New_Balance'] // NEW BALANCE

    if (newBalance >= 0) { // Input validation.
        // Check if the USER exist
        db.any('SELECT * FROM User_Info WHERE User_ID = $1', [userID]).then(rows=>{
            if (rows.length === 0) {
                res.send({
                    success:true,
                    error:true,
                    errors:{
                        User_DNE:true
                    }
                })
            } else {
                // Update USER's balance with NEW BALANCE
                db.any('UPDATE Bank SET Balance = $1 WHERE User_ID = $2', [newBalance, userID]).then(()=>{
                    res.send({success:true})
                }).catch(()=>{
                    res.send({success:false})
                })
            }
        }).catch(()=>{
            res.send({success:false})
        })
    } else {
        res.send({
            success:true,
            error:true,
            errors:{
                Tries_to_set_negative_balance:true
            }
        })
    }

});
module.exports = router;
