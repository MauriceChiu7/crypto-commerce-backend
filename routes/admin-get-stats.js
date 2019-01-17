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
admin-get-stats
input: userID
post: Returns two lists. First list is records of outgoing transfers made my userID, second is records of incoming transfers of userID
*/

router.post('/', (req, res) => {
    const userID = req.body['User_ID'] // USER

    // Check if USER exist
    db.any('SELECT * FROM User_Info WHERE User_ID = $1', [userID]).then(users=>{
        if (users.length === 0) { // If not, break
            res.send({
                success:true,
                error:true,
                errors:{
                    User_DNE:true
                }
            })
        } else { // If yes, return incoming transfers
            // Returns records which Recipient_ID in Transfers matches userID
            db.any('SELECT C.Currency_Type, U.Fname, U.Lname, T.Num_of_Coins, T.Date_Time FROM Crypto_Data C, User_Info U, Transfers T WHERE C.Crypto_ID = T.Crypto_ID AND $1 = T.Recipient_ID AND U.User_ID = T.User_ID', [userID]).then(incoming=>{
                // Returns records which User_ID in Transfers matches userID
                db.any('SELECT C.Currency_Type, U.Fname, U.Lname, T.Num_of_Coins, T.Date_Time FROM Crypto_Data C, User_Info U, Transfers T WHERE C.Crypto_ID = T.Crypto_ID AND $1 = T.User_ID AND U.User_ID = T.Recipient_ID', [userID]).then(outgoing=>{
                    res.send({
                        success:true,
                        incoming:incoming,
                        outgoing:outgoing
                    })
                }).catch(()=>{
                    res.send({success:false})
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
