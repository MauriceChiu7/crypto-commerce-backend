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
get-transactions
input: userID
post: return every transaction with userID involved
*/

router.post('/', (req, res) => {
    const userID = req.body['User_ID'] // USER

    // Check if the USER exist
    db.any('SELECT * FROM User_Info WHERE User_ID = $1', [userID]).then(users=>{
        if (users.length === 0) { // If no records are being returned, the USER doesn't exist
            res.send({
                success:true,
                error:true,
                errors:{
                    User_DNE:true
                }
            })
        } else { // If USER exist
            // Returns every transactions with USER involved.
            db.any('SELECT T.Transaction_ID, T.User_ID, T.Crypto_ID, T.Num_of_Coins, T.Price_per_Unit, T.Date_Time, T.Transaction_Type, C.Currency_Type FROM Transactions T, Crypto_Data C WHERE User_ID = $1 AND T.Crypto_ID = C.Crypto_ID', [userID]).then(trans=>{
                res.send({
                    success:true,
                    error:false,
                    trans:trans
                })
            }).catch(()=>{
                res.send({success:false})
            })
        }
    }).catch(()=>{
        res.send({success:false})
    })

});
module.exports = router;
