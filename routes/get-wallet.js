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
get-wallet
input userID
post: returns all the information of crypto currencies that's owned by userID
*/

router.post('/', (req, res) => {
   const userID = req.body['User_ID'] // USER

   // Returns all the information of crypto currencies that's owned by USER
   db.any('SELECT W.Crypto_ID, D.Currency_Type, User_ID, Num_of_Coins, D.Price_per_Unit, W.Num_of_Coins*D.Price_per_Unit AS "Equity" FROM Crypto_Wallet W, Crypto_Data D WHERE User_ID = $1 AND W.Crypto_ID = D.Crypto_ID', [userID]).then(rows=>{

        if (rows.length === 0) {
            res.send({
                success:true,
                error:true,
                errors:{
                    User_DNE:true
                }
            })
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
