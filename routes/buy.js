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
buy
input: userID, cryptoID, numOfCoins, pricePerUnit, orderID
post: Insert or update seller's Wallet and Insert new record to Transactions if userID is allowed to make a purchase.
*/

router.post('/', (req, res) => {
    const userID = req.body['User_ID'] // USER
    const cryptoID = req.body['Crypto_ID'] // The coin the USER is buying
    const numOfCoins = req.body['Num_of_Coins'] // The listed number of coins for sell
    const pricePerUnit = req.body['Price_per_Unit'] // The listed price per unit for sell
    const orderID = req.body['Order_ID'] // The Order_ID for that listing

    // Check if USER exist
    db.any('SELECT * FROM Bank WHERE User_ID = $1', [userID]).then(userBalance=>{
        if (userBalance.length === 0) {
            res.send({
                success:true,
                error:true,
                errors:{
                    User_DNE:true
                }
            })
        } else {
            // Check if USER's Balance >= numOfCoins*pricePerUnit
            if (parseInt(userBalance[0].balance) >= numOfCoins*pricePerUnit) { // If yes
                // Update USER's Balance
                db.any('UPDATE Bank SET Balance = $1 WHERE User_ID = $2', [parseInt(userBalance[0].balance)-numOfCoins*pricePerUnit, userID]).then(()=>{
                    // Check if coin type exists
                    db.any('SELECT * FROM Crypto_Wallet WHERE User_ID = $1 AND Crypto_ID = $2', [userID, cryptoID]).then(userWallet=>{
                        // If coin exist
                        if (userWallet.length === 1) {
                            // Update USER's Wallet
                            db.any('UPDATE Crypto_Wallet SET Num_of_Coins = $1 WHERE Crypto_ID = $2 AND User_ID = $3', [parseInt(userWallet[0].num_of_coins)+parseInt(numOfCoins), cryptoID, userID]).then(()=>{
                                // Insert new purchase record in Transactions for USER (BUYER)
                                db.any('INSERT INTO Transactions VALUES (DEFAULT, $1, $2, $3, $4, CURRENT_TIMESTAMP, TRUE)', [userID, cryptoID, numOfCoins, pricePerUnit]).then(()=>{
                                    // Find out who the SELLER is for this order
                                    db.any('SELECT * FROM Open_Orders WHERE Order_ID = $1', [orderID]).then(order=>{
                                        // Insert sale record in Transactions for SELLER
                                        db.any('INSERT INTO Transactions VALUES (DEFAULT, $1, $2, $3, $4, CURRENT_TIMESTAMP, FALSE)', [order[0].user_id, cryptoID, numOfCoins, pricePerUnit]).then(()=>{
                                            // Get SELLER's current Balance
                                            db.any('SELECT * FROM Bank WHERE User_ID = $1', [order[0].user_id]).then(sellerBank=>{
                                                // Increase SELLER's Balance
                                                db.any('UPDATE Bank SET Balance = $1 WHERE User_ID = $2', [parseInt(sellerBank[0].balance)+(numOfCoins*pricePerUnit), order[0].user_id]).then(()=>{
                                                    // Remove listing from Open_Orders
                                                    db.any('DELETE FROM Open_Orders WHERE Order_ID = $1', [orderID]).then(()=>{
                                                        res.send({
                                                            success:true,
                                                            error:false,
                                                            actions:{
                                                                Transactions_inserted_Listing_removed:true
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
                                        }).catch(()=>{
                                            res.send({success:false})
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
                        } else if (userWallet.length === 0){ // If coin DNE
                            // Insert to USER's Wallet
                            db.any('INSERT INTO Crypto_Wallet VALUES ($1, $2, $3)', [cryptoID, userID, numOfCoins]).then(()=>{
                                // Insert new purchase record in Transactions for USER (BUYER)
                                db.any('INSERT INTO Transactions VALUES (DEFAULT, $1, $2, $3, $4, CURRENT_TIMESTAMP, TRUE)', [userID, cryptoID, numOfCoins, pricePerUnit]).then(()=>{
                                    // Find out who the SELLER is for this order
                                    db.any('SELECT * FROM Open_Orders WHERE Order_ID = $1', [orderID]).then(order=>{
                                        // Insert sale record in Transactions for SELLER
                                        db.any('INSERT INTO Transactions VALUES (DEFAULT, $1, $2, $3, $4, CURRENT_TIMESTAMP, FALSE)', [order[0].user_id, cryptoID, numOfCoins, pricePerUnit]).then(()=>{
                                            // Get SELLER's current Balance
                                            db.any('SELECT * FROM Bank WHERE User_ID = $1', [order[0].user_id]).then(sellerBank=>{
                                                // Increase SELLER's Balance
                                                db.any('UPDATE Bank SET Balance = $1 WHERE User_ID = $2', [parseInt(sellerBank[0].balance)+(numOfCoins*pricePerUnit), order[0].user_id]).then(()=>{
                                                    // Remove listing from Open_Orders
                                                    db.any('DELETE FROM Open_Orders WHERE Order_ID = $1', [orderID]).then(()=>{
                                                        res.send({
                                                            success:true,
                                                            error:false,
                                                            actions:{
                                                                Transactions_inserted_Listing_removed:true
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
                                        }).catch(()=>{
                                            res.send({success:false})
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
            } else { // If no
                res.send({
                    success:true,
                    error:true,
                    errors:{
                        Not_enough_balance:true
                    }
                })
            }
        }
    }).catch(()=>{
        res.send({success:false})
    })

});
module.exports = router;
