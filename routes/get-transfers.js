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
get-transfers
input userID
post: returns all of the transfers records (both incoming and outgoing) of userID
*/

router.post('/', (req, res) => {
    const userID = req.body['User_ID'] // USER

    // Returns all of the transfers records (both incoming and outgoing) of USER
    db.any('SELECT T.User_ID, T.Recipient_ID, U.Fname AS User_F, U.Lname AS User_L, R.Fname AS Rec_F, R.Lname AS Rec_L, C.Currency_Type, T.Num_of_Coins, T.Date_Time FROM User_Info U, User_Info R, Crypto_Data C, Transfers T WHERE (T.Recipient_ID = $1 OR T.User_ID = $1) AND T.User_ID = U.User_ID AND T.Recipient_ID = R.User_ID AND T.Crypto_ID = C.Crypto_ID ORDER BY T.Date_Time ASC', [userID]).then(rows=>{
        if (rows.length === 0) {
            res.send({
                success:true,
                error:true,
                errors:{
                    No_transfer_record_of_this_user:true
                }
            })
        } else {
            res.send({
                success:true,
                error:false,
                rows:rows
            })
        }
    }).catch(()=>{
        res.send({success:false})
    })
});
module.exports = router;
