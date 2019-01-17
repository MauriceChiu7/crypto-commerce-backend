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
make-out-bound-transfer
input: userID, numOfCoins, recipientID, cryptoID
pre: check userID wallet, subtract numOfCoins if allowed
post: update or insert numOfCoins for recipientID
*/

router.post('/', (req, res) => {
    const userID = req.body['User_ID'] // USER
    const numOfCoins = parseInt(req.body['Num_of_Coins']) // Number of coins
    const recipientID = req.body['Recipient_ID'] // RECIPIENT
    const cryptoID = req.body['Crypto_ID'] // Crypto ID

    // Check if USER has the coin type and that num of coins > 0.
    db.any('SELECT * FROM Crypto_Wallet WHERE User_ID = $1 AND Crypto_ID = $2', [userID, cryptoID]).then(userWallet=>{
        // Check if USER has the coin type.
        if (userWallet.length === 1) {
            // Check if USER has enough coins.
            if (numOfCoins <= parseInt(userWallet[0].num_of_coins)) {
                // If so, deduct said amount from USER.
                db.any('UPDATE Crypto_Wallet SET Num_of_Coins = $1 WHERE Crypto_ID = $2 AND User_ID = $3', [parseInt(userWallet[0].num_of_coins)-numOfCoins, cryptoID, userID]).then(()=>{
                    // Check if RECIPIENT have the coin type.
                    db.any('SELECT * FROM Crypto_Wallet WHERE Crypto_ID = $1 AND User_ID = $2', [cryptoID, recipientID]).then(recipientWallet=>{
                        if (recipientWallet.length === 1) { // If RECIPIENT has the coin type.
                            // Update said amount for RECIPIENT.
                            db.any('UPDATE Crypto_Wallet SET Num_of_Coins = $1 WHERE Crypto_ID = $2 AND User_ID = $3', [parseInt(recipientWallet[0].num_of_coins)+numOfCoins, cryptoID, recipientID]).then(()=>{
                                // Insert new Transfer record.
                                db.any('INSERT INTO Transfers VALUES (DEFAULT, $1, $2, $3, $4, CURRENT_TIMESTAMP)', [cryptoID, userID, recipientID, numOfCoins]).then(()=>{
                                    res.send({
                                        success:true,
                                        error:false,
                                        actions:{
                                            Transfer_record_inserted:true
                                        }
                                    })
                                }).catch(()=>{
                                    res.send({success:false})
                                })
                            }).catch(()=>{
                                res.send({success:false})
                            })
                        } else if (recipientWallet.length === 0) { // If RECIPIENT doesn't have the coin type.
                            // Insert said amount for RECIPIENT.
                            db.any('INSERT INTO Crypto_Wallet VALUES ($1, $2, $3)', [cryptoID, recipientID, numOfCoins]).then(()=>{
                                // Insert new Transfer record.
                                db.any('INSERT INTO Transfers VALUES (DEFAULT, $1, $2, $3, $4, CURRENT_TIMESTAMP)', [cryptoID, userID, recipientID, numOfCoins]).then(()=>{
                                    res.send({
                                        success:true,
                                        error:false,
                                        actions:{
                                            Transfer_record_inserted:true
                                        }
                                    })
                                }).catch(()=>{
                                    res.send({success:false})
                                })
                            }).catch(()=>{
                                res.send({success:false})
                            })
                        } else { // Should never happen
                            res.send({
                                success:true,
                                error:true,
                                errors:{
                                    Duplicate_entry_of_the_same_coin:true
                                }
                            })
                        }
                    }).catch(()=>{
                        res.send({success:false})
                    })
                }).catch(()=>{
                    res.send({success:false})
                })
            } else {
                res.send({
                    success:true,
                    error:true,
                    errors:{
                        Have_coin_not_enough:true
                    }
                })
            }
        } else { // Transferer doesn't have the coin type.
            res.send({
                success:true,
                error:true,
                errors:{
                    No_coins_of_this_type:true
                }
            })
        }
    }).catch(()=>{
        res.send({success:false})
    })
});
module.exports = router;
