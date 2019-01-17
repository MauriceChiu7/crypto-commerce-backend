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
get-open-orders
input: no input
post: return every record in Open_Orders as two lists: myListings and buyables
*/

router.post('/', (req, res) => {
    const userID = req.body['User_ID'] // USER

    // Returns every order that is listed by the USER in Open_Orders. (i.e. What the USER is selling (My Listings))
    db.any('SELECT O.Order_ID, O.User_ID, O.Crypto_ID, C.Currency_Type, O.Order_Type, O.Num_of_Coins, O.Price_per_Unit, U.Fname, U.Lname FROM Open_Orders O, User_Info U, Crypto_Data C WHERE O.User_ID = $1 AND Order_Type = $2 AND O.User_ID = U.User_ID AND O.Crypto_ID = C.Crypto_ID', [userID, false]).then(myListings=>{
        // Returns every order that is listed by other users except for the USER. (i.e. What other people are selling (Other People's Listings))
        db.any('SELECT O.Order_ID, O.User_ID, O.Crypto_ID, C.Currency_Type, O.Order_Type, O.Num_of_Coins, O.Price_per_Unit, U.Fname, U.Lname FROM Open_Orders O, User_Info U, Crypto_Data C WHERE O.User_ID != $1 AND Order_Type = $2 AND O.User_ID = U.User_ID AND O.Crypto_ID = C.Crypto_ID', [userID, false]).then(buyables=>{
            res.send({
                success:true,
                buyables:buyables,
                myListings:myListings
            })
        }).catch(()=>{
            res.send({success:false})
        })
    }).catch(()=>{
        res.send({success:false})
    })

});
module.exports = router;
