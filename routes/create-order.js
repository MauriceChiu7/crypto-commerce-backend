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
create-order
input: SERIAL userID, INT cryptoID, BOOLEAN orderType, INT numOfCoins, DECIMAL(38, 2) pricePerUnit
post: insert new order into Open_Orders
*/

router.post('/', (req, res) => {
    const userID = req.body['User_ID'] // USER (DEFAULT)
    const cryptoID = req.body['Crypto_ID'] // Currency (INT)
    const orderType = req.body['Order_Type'] // true = Buy; false = Sell
    const numOfCoins = req.body['Num_of_Coins'] // Number of coins
    const pricePerUnit = req.body['Price_per_Unit'] // Price per unit

    // Check Order_Type
    if (orderType === false) { // Selling
        // Check if USER have enough Num_of_Coins in Crypto_Wallet of type Currency_Type
        db.any('SELECT * FROM Crypto_Wallet WHERE User_ID = $1 AND Crypto_ID = $2', [userID, cryptoID]).then(userWallet=>{
            if (parseInt(userWallet[0].num_of_coins) >= numOfCoins) { // If have enough Num_of_Coins
                // Deduct numOfCoins from USER's Wallet
                db.any('UPDATE Crypto_Wallet SET Num_of_Coins = $1 WHERE User_ID = $2 AND Crypto_ID = $3', [parseInt(userWallet[0].num_of_coins)-numOfCoins, userID, cryptoID]).then(()=>{
                    // Get User's Balance
                    db.any('SELECT * FROM Bank WHERE User_ID = $1', [userID]).then(userBank=>{
                        // Create selling order
                        db.any('INSERT INTO Open_Orders VALUES (DEFAULT, $1, $2, $3, $4, $5)', [userID, cryptoID, orderType, numOfCoins, pricePerUnit]).then(()=>{
                            res.send({
                                success:true,
                                error:false,
                                actions:{
                                    Selling_order_submitted:true
                                }
                            })
                        }).catch(()=>{
                            res.send({success:false})
                        })
                    }).catch(()=>{
                        res.send({success:false})
                    })
                }).catch(()=>{
                    res.send({success:false})
                })
            } else { // Else, break
                res.send({
                    success:true,
                    error:true,
                    errors:{
                        Not_enough_coins:true
                    }
                })
            }
        }).catch(()=>{
            res.send({success:false})
        })
    } else { // Else, break
        res.send({
            success:true,
            error:true,
            errors:{
                Wrong_order_type:true
            }
        })
    }
});
module.exports = router;
