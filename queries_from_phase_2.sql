/** Below is PART C which consists of 10 queries. **/

-- Query 1
-- Purpose: retrievs the purchase history of a user.
-- Expected: a table summarizing purchasing records that includes the Coin's name, number of coins, and the equity of each purchase made by the user ‘Hari’.
SELECT U.Fname, U.Lname, D.Currency_Type, C.Num_of_Coins, (D.Price_per_Unit * C.Num_of_Coins) AS "Total Equity"
FROM User_Info U, Crypto_Wallet C, Crypto_Data D
WHERE U.User_ID  = C.User_ID
    AND C.Crypto_Id = D.Crypto_Id
    AND U.Fname = 'Hari';

-- *******************************
-- Query 2
-- Purpose: retrieves the number of times any user has purchased a type of Coin based on the input coin name.
-- Expected: a table summarizing the number of purchases that each user have made on any coin which name starts with ‘Bit’.
SELECT U.Fname, U.Lname, COUNT(W.User_ID) AS "Number of Purchases"
FROM Crypto_Wallet W, User_Info U
WHERE W.User_ID = U.User_ID AND W.Crypto_ID IN (
    SELECT D.Crypto_ID
    FROM Crypto_Data D
    WHERE D.Currency_Type LIKE 'Bit%'
) GROUP BY U.Fname, U.Lname;

-- *******************************
-- We commented this query out because it cannot be run in PostgresSQL.
-- Query 3
-- Purpose: retrieves transactions which amount exceeds the average of all transaction amounts.
-- Expected: a table summarizing all the transactions which amount exceeds 6550 (the average of all transactions). Information includes Transaction_ID and Transaction Amount.
-- SELECT Transaction_ID, (Num_of_Coins * Price_per_Unit) AS "Transaction Amount (USD)"
-- FROM Transactions OUTER JOIN
-- WHERE (Num_of_Coins * Price_per_Unit) > (
--     SELECT AVG(Num_of_Coins * Price_per_Unit)
--     FROM Transactions
--     WHERE Crypto_ID = outer.Crypto_ID
-- );

-- *******************************
-- Query 4
-- Purpose: retrieves information about the currency type, amount owned, and price per unit of such that currency type.
-- Expected: a table summarizing all of the different type of currency, the amount of it, and the price per unit at the time of purchase of all users. Sorted by User_ID.
SELECT Crypto_Wallet.User_ID, Crypto_Data.Currency_Type, Crypto_Wallet.Num_of_Coins, Crypto_Data.Price_per_Unit
FROM Crypto_Wallet FULL JOIN Crypto_Data ON Crypto_Wallet.Crypto_ID = Crypto_Data.Crypto_ID
ORDER BY Crypto_Wallet.User_ID;

-- *******************************
-- We commented this query out because it cannot be run in PostgresSQL.
-- Query 5
-- Purpose: retrieves all the cryptocurrency bought by a user.
-- Expected: a table summarizing all the buying records of the user 'Hari'. Information includes Currency_Type, Num_of_Coins, Price_per_Unit of that coin, and the time of transaction.
-- SELECT U.Fname, U.Lname, D.Currency_Type, T.Num_of_Coins, T.Price_per_Unit, T.Date_Time, T.Transaction_Type
-- FROM User_Info U, Crypto_Data D, Transactions T
-- WHERE U.Fname = 'Hari'
--     AND U.User_ID = T.User_ID
--     AND D.Crypto_ID = T.Crypto_ID
--     AND Transaction_ID IN (SELECT Transaction_ID
--         FROM Transactions
--         MINUS -- Same as EXCEPT
--         SELECT Transaction_ID
--         FROM Transactions
--         WHERE Transaction_Type = FALSE
--     );

-- *******************************
-- Query 6
-- Purpose: retrieves deposit records of a user.
-- Expected: a table summarizing each incoming transfer for user 'Hari'. Information includes the name of the people who made the transfer, the number of coins, and the type of coins.
-- In simpler terms: All the people who've sent money to Hari.
SELECT Fname, Lname, Num_of_Coins, Currency_Type
FROM User_Info U, Crypto_Data D, Transfers T
WHERE U.User_Id = T.User_Id
    AND D.Crypto_Id = T.Crypto_ID
    AND T.Recipient_ID = (
        SELECT User_ID
        FROM User_Info
        WHERE Fname = 'Hari'
    );


-- *******************************
-- Query 7
-- Purpose: retrieves payment records of a user.
-- Expected: a table summarizing each outgoing transfer made my user ‘Hari’. Information includes the name of the recipient, the number of coins, and the type of coins.
-- In simpler terms: All the people who Hari has sent money to.
SELECT Fname, Lname, Num_of_Coins, Currency_Type
FROM User_Info U, Crypto_Data D, Transfers T
WHERE U.User_Id = T.Recipient_Id
    AND D.Crypto_Id = T.Crypto_ID
    AND T.User_Id = (
        SELECT User_ID
        FROM User_Info
        WHERE Fname = 'Hari'
    );

-- *******************************
-- Query 8
-- Purpose: retrieves information about all of the users who are looking to buy. Other users would want to see this list when they want to sell. Vise versa when O.Order_Type = FALSE.
-- Expected: a table showing records in table Open_Orders with Order_type equals to 'Buy'.
SELECT I.Fname, I.Lname, D.Currency_Type, O.Order_Type, O.Num_of_coins, O.price_per_unit
FROM User_Info I, Crypto_Data D, Open_Orders O
WHERE I.User_Id = O.User_Id AND O.Crypto_Id = D.Crypto_Id AND O.Order_Type = TRUE;

-- *******************************
-- Query 9
-- Purpose: retrieves the total number of coins purchased by any users and the results are sorted by the total number of coins purchased.
-- Expected: a table summarizing the total number of coins by any users.
SELECT D.Currency_Type, SUM(C.Num_Of_Coins) AS "Number of coins purchased across all users"
FROM User_Info U, Crypto_Wallet C, Crypto_Data D
WHERE U.User_ID = C.User_ID AND C.Crypto_Id = D.Crypto_Id
GROUP BY D.Currency_Type
ORDER BY SUM(C.Num_Of_Coins) DESC;

-- *******************************
-- Query 10
-- Purpose: retrieves the number of outbound transfers made by each user.
-- Expected: a table summarizing the user's name and how many times he or she has made an outbound transfer.
SELECT I.Fname, I.Lname, COUNT(*) AS "Outbound Transfers"
FROM Transfers T, User_Info I
WHERE T.user_id = I.user_id AND T.User_Id IN (SELECT User_id FROM User_Info)
GROUP BY I.Fname, I.Lname;

-- *******************************
-- Query 11
-- Purpose: retrieves the number of inbound transfers of each user.
-- Expected: a table summarizing the user's name and how many times he or she has received an inbound transfer.
SELECT I.Fname, I.Lname, COUNT(*) AS "Inbound Transfers"
FROM Transfers T, User_Info I
WHERE T.Recipient_Id = I.user_id AND T.Recipient_Id IN (SELECT User_id FROM User_Info)
GROUP BY I.Fname, I.Lname;
