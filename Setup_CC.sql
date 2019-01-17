/**
    TCSS 445 Fall 2018
    Project Phase III
    Group D: Hari Kuduva, Maurice Chiu, Aayush Shah
    DBMS Used: PostgreSQL

    CryptoCommerce is a platform for buying, selling, and transfering
    crypto currency. Think Paypal but for Cryptocurrency. **/

/** Below is PART A consists of DDL for the table creation. The example tuples
    are in the order of the column definitions. The schema diagram can be found in the PDF. **/

-- User Info Table to store basic User details
-- Example tuple will be <1, 'Hari', 'Kuduva', 'sriharik@uw.edu', 'Court 17', '1234567890'>
DROP TABLE IF EXISTS User_Info CASCADE;
CREATE TABLE User_Info (
    User_ID SERIAL,
    FName VARCHAR(255) NOT NULL,
    LName VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    Addr VARCHAR(255) NOT NULL,
    Phone CHAR(10),
    PRIMARY KEY(User_ID)
);

-- Crypto Data table stores information about each crypto currency
-- Lets say we have Bitcoin priced at the current rate of 6400
-- Example tuple will be <100, 'Bitcoin', 6400> where 100 is primary key
DROP TABLE IF EXISTS Crypto_Data CASCADE;
CREATE TABLE Crypto_Data (
    Crypto_ID SERIAL,
    Currency_Type VARCHAR(255) NOT NULL,
    Price_per_Unit DECIMAL(38, 2) NOT NULL,
    CHECK(Price_per_Unit > 0), -- First Check
    PRIMARY KEY(Crypto_ID)
);

-- Transfers table stores information about who transfered what to who and when
-- Lets say User 1 transfers 12 bitcoin to User 2 (where 1 and 2 are foreign key relations)
-- Example tuple will be <1, 100, 1, 2, 12, CURRENT_TIMESTAMP>
DROP TABLE IF EXISTS Transfers CASCADE;
CREATE TABLE Transfers (
    Transfer_ID SERIAL,
    Crypto_ID INT NOT NULL,
    User_ID INT NOT NULL,
    Recipient_ID INT NOT NULL,
    Num_of_Coins DECIMAL(38,2) DEFAULT(10), -- First Default
    Date_Time TIMESTAMP,
    CHECK (Num_of_Coins > 0), -- Second Check
    PRIMARY KEY (Transfer_ID),
    FOREIGN KEY (User_ID) REFERENCES User_Info(User_ID) ON DELETE SET NULL, -- ON UPDATE CASCADE
    FOREIGN KEY (Crypto_ID) REFERENCES Crypto_Data(Crypto_ID) ON DELETE SET NULL, -- ON UPDATE CASCADE
    FOREIGN KEY (Recipient_ID) REFERENCES User_Info(User_ID) ON DELETE SET NULL -- ON UPDATE CASCADE
);

-- Transaction table stores information about buy/sell from internet at specific rates
-- Lets say User 1 is selling 12 bitcoin @ 6000 each
-- Example tuple will be <1, 1, 100, 12, 6000, CURRENT_TIMESTAMP, 0>
DROP TABLE IF EXISTS Transactions CASCADE;
CREATE TABLE Transactions (
    Transaction_ID SERIAL,
    User_ID INT NOT NULL,
    Crypto_ID INT NOT NULL,
    Num_of_Coins DECIMAL(38, 2) DEFAULT(10), -- Second Default
    Price_per_Unit DECIMAL(38, 2) NOT NULL,
    Date_Time TIMESTAMP,
    Transaction_Type BOOLEAN NOT NULL, -- 1 for incoming(buying), 0 for outgoing(selling)
    CHECK(Num_of_Coins > 0), -- Third Check
    CHECK(Price_per_Unit > 0), -- Fourth Check
    PRIMARY KEY(Transaction_ID),
    FOREIGN KEY (User_ID) REFERENCES User_Info(User_ID) ON DELETE CASCADE, -- ON UPDATE CASCADE
    FOREIGN KEY (Crypto_ID) REFERENCES Crypto_Data(Crypto_ID) ON DELETE SET NULL -- ON UPDATE CASCADE
);

-- Bank table stores financial details for each user
-- Lets say User 1 has 500 USD in his account
-- Example tuple will be <5, 1, 500> where 5 is PK
DROP TABLE IF EXISTS Bank CASCADE;
CREATE TABLE Bank (
    User_ID INT NOT NULL,
    Balance DECIMAL(38, 2) DEFAULT(0), -- Third Default
    PRIMARY KEY(User_ID),
    FOREIGN KEY (User_ID) REFERENCES User_Info(User_ID) ON DELETE CASCADE -- ON UPDATE CASCADE
);

-- Open_Orders stores the pending/available offers available from other users
-- Scenario: User 1 wants to open a listing to sell 100 bitcoin @ 6,000 each
-- Example tuple will be <1, 100, 0, 100, 6000>
DROP TABLE IF EXISTS Open_Orders CASCADE;
CREATE TABLE Open_Orders (
    Order_ID SERIAL,
    User_ID INT NOT NULL,
    Crypto_ID INT NOT NULL,
    Order_Type BOOLEAN NOT NULL, -- 1 for incoming(buy), 0 for outgoing(sell)
    Num_of_Coins DECIMAL(38, 2) DEFAULT(10), -- Fourth Default
    Price_per_Unit DECIMAL(38, 2) NOT NULL,
    CHECK(Price_per_Unit > 0), -- Fifth Check
    CHECK(Num_of_Coins > 0), -- Sixth Check
    PRIMARY KEY (Order_ID),
    FOREIGN KEY (User_ID) REFERENCES User_Info(User_ID) ON DELETE CASCADE, -- ON UPDATE CASCADE
    FOREIGN KEY (Crypto_ID) REFERENCES Crypto_Data(Crypto_ID) ON DELETE SET NULL -- ON UPDATE CASCADE
);

-- Crypto_Wallet stores information about the different cryptocurrencies each user has
-- Scenario: User 1 has 50 bitcoin in his account
-- Example tuple will be <100, 1, 50>
DROP TABLE IF EXISTS Crypto_Wallet CASCADE;
CREATE TABLE Crypto_Wallet (
    Crypto_ID INT NOT NULL,
    User_ID INT NOT NULL,
    Num_of_Coins DECIMAL(38,2) DEFAULT(0), -- Fifth Default
    PRIMARY KEY (Crypto_ID, User_ID),
    FOREIGN KEY (User_ID) REFERENCES User_Info(User_ID) ON DELETE CASCADE, -- ON UPDATE CASCADE
    FOREIGN KEY (Crypto_ID) REFERENCES Crypto_Data(Crypto_ID) ON DELETE SET NULL -- ON UPDATE CASCADE
);

/** Below is PART B which consists of fake data for Crypto Commerce **/

-- User_Info
INSERT INTO User_Info VALUES (DEFAULT, 'Hari', 'Kuduva', 'hari@uw.edu', 'Tacoma', '1234567890');
INSERT INTO User_Info VALUES (DEFAULT, 'Aayush', 'Shah', 'shah@uw.edu', 'Seattle', '2234567890');
INSERT INTO User_Info VALUES (DEFAULT, 'Maurice', 'Chiu', 'maurice@uw.edu', 'Tacoma', '3234567890');
INSERT INTO User_Info VALUES (DEFAULT, 'Bill', 'Gates', 'BillG@Microsoft.com', 'Bellevue', '4234567890');
INSERT INTO User_Info VALUES (DEFAULT, 'Steve', 'Jobs', 'sjobs@apple.com', 'NYC', '5234567890');
INSERT INTO User_Info VALUES (DEFAULT, 'Tim', 'Cook', 'tcook@apple.com', 'SF', '6234567890');
INSERT INTO User_Info VALUES (DEFAULT, 'Satya', 'Nadella', 'sn@Microsoft.com', 'Redmond', '7234567890');
INSERT INTO User_Info VALUES (DEFAULT, 'Sundar', 'Pichai', 'pichaiS@google.com', 'Bay Area', '8234567890');
INSERT INTO User_Info VALUES (DEFAULT, 'Jong Un', 'Kim', 'kimJ@uw.edu', 'Korea', '9234567890');
INSERT INTO User_Info VALUES (DEFAULT, 'Donald', 'Trump', 'dt@uw.edu', 'White House', '9934567890');

-- Crypto_Data
INSERT INTO Crypto_Data VALUES (DEFAULT, 'Bitcoin', 7820);
INSERT INTO Crypto_Data VALUES (DEFAULT, 'Ethereum', 6584);
INSERT INTO Crypto_Data VALUES (DEFAULT, 'XRP', 4793);
INSERT INTO Crypto_Data VALUES (DEFAULT, 'Ethereum Cash', 5792);
INSERT INTO Crypto_Data VALUES (DEFAULT, 'EOS', 3157);
INSERT INTO Crypto_Data VALUES (DEFAULT, 'Litecoin', 4483);
INSERT INTO Crypto_Data VALUES (DEFAULT, 'Cardano', 7216);
INSERT INTO Crypto_Data VALUES (DEFAULT, 'Tether', 3200);
INSERT INTO Crypto_Data VALUES (DEFAULT, 'Bitcoin Gold', 5974);
INSERT INTO Crypto_Data VALUES (DEFAULT, 'Nano', 3241);

-- Crypto_Wallet
INSERT INTO Crypto_Wallet VALUES (1, 1, 50);
INSERT INTO Crypto_Wallet VALUES (2, 2, 50);
INSERT INTO Crypto_Wallet VALUES (3, 3, 50);
INSERT INTO Crypto_Wallet VALUES (4, 4, 50);
INSERT INTO Crypto_Wallet VALUES (5, 5, 50);
INSERT INTO Crypto_Wallet VALUES (6, 6, 50);
INSERT INTO Crypto_Wallet VALUES (7, 7, 50);
INSERT INTO Crypto_Wallet VALUES (8, 8, 50);
INSERT INTO Crypto_Wallet VALUES (9, 9, 50);
INSERT INTO Crypto_Wallet VALUES (10, 10, 50);

-- Bank
INSERT INTO Bank VALUES (1, 500000);
INSERT INTO Bank VALUES (2, 12500);
INSERT INTO Bank VALUES (3, 50000);
INSERT INTO Bank VALUES (4, 57830);
INSERT INTO Bank VALUES (5, 51540);
INSERT INTO Bank VALUES (6, 45650);
INSERT INTO Bank VALUES (7, 49010);
INSERT INTO Bank VALUES (8, 56210);
INSERT INTO Bank VALUES (9, 10450);
INSERT INTO Bank VALUES (10,19750);

/**
 * Note to Grader:
 *
 * We’ve commented out the INSERT statements below for Open_Orders, Transfers, and Transactions
 * table from our DDL (Setup_CC.sql). Because these INSERT statements are not run in real time so
 * they don’t go through the proper checking procedures that our app does when run in real time
 * and will produce inconsistent data. For example, a user’s transfer history might show that he
 * or she has received 5 Bitcoins but it does not show up in the user’s Crypto Wallet.
 *
 * We’ve left it in the DDL (Setup_CC.sql) so these are here for you to use but please be aware of
 * the above mentioned case. You would, however, want to un-comment these INSERT statements if you
 * want to see all the tables in their populated state.
 */

-- Transfers
-- INSERT INTO Transfers VALUES (DEFAULT, 1, 1, 2, 15, CURRENT_TIMESTAMP);
-- INSERT INTO Transfers VALUES (DEFAULT, 2, 2, 3, 10, CURRENT_TIMESTAMP);
-- INSERT INTO Transfers VALUES (DEFAULT, 3, 3, 4, 1, CURRENT_TIMESTAMP);
-- INSERT INTO Transfers VALUES (DEFAULT, 4, 4, 5, 6, CURRENT_TIMESTAMP);
-- INSERT INTO Transfers VALUES (DEFAULT, 5, 5, 6, 34, CURRENT_TIMESTAMP);
-- INSERT INTO Transfers VALUES (DEFAULT, 6, 6, 7, 100, CURRENT_TIMESTAMP);
-- INSERT INTO Transfers VALUES (DEFAULT, 7, 7, 8, 11, CURRENT_TIMESTAMP);
-- INSERT INTO Transfers VALUES (DEFAULT, 8, 8, 9, 9, CURRENT_TIMESTAMP);
-- INSERT INTO Transfers VALUES (DEFAULT, 9, 9, 10, 12, CURRENT_TIMESTAMP);
-- INSERT INTO Transfers VALUES (DEFAULT, 10, 10, 1, 37, CURRENT_TIMESTAMP);

-- Transactions
-- INSERT INTO Transactions VALUES (DEFAULT, 1, 2, 3, 6100, CURRENT_TIMESTAMP, TRUE);
-- INSERT INTO Transactions VALUES (DEFAULT, 2, 3, 10, 6200, CURRENT_TIMESTAMP, FALSE);
-- INSERT INTO Transactions VALUES (DEFAULT, 3, 4, 5, 6300, CURRENT_TIMESTAMP, TRUE);
-- INSERT INTO Transactions VALUES (DEFAULT, 4, 5, 6, 6400, CURRENT_TIMESTAMP, FALSE);
-- INSERT INTO Transactions VALUES (DEFAULT, 5, 2, 12, 6500, CURRENT_TIMESTAMP, TRUE);
-- INSERT INTO Transactions VALUES (DEFAULT, 6, 3, 15, 6600, CURRENT_TIMESTAMP, FALSE);
-- INSERT INTO Transactions VALUES (DEFAULT, 7, 4, 8, 6700, CURRENT_TIMESTAMP, TRUE);
-- INSERT INTO Transactions VALUES (DEFAULT, 8, 5, 9, 6800, CURRENT_TIMESTAMP, FALSE);
-- INSERT INTO Transactions VALUES (DEFAULT, 9, 2, 11, 6900, CURRENT_TIMESTAMP, TRUE);
-- INSERT INTO Transactions VALUES (DEFAULT, 10, 3, 1, 7000, CURRENT_TIMESTAMP, FALSE);

-- Open_Orders
-- INSERT INTO Open_Orders VALUES (DEFAULT, 1, 1, TRUE, 12, 6100);
-- INSERT INTO Open_Orders VALUES (DEFAULT, 2, 2, FALSE, 32, 6200);
-- INSERT INTO Open_Orders VALUES (DEFAULT, 3, 3, TRUE, 3, 6300);
-- INSERT INTO Open_Orders VALUES (DEFAULT, 4, 4, FALSE, 4, 6400);
-- INSERT INTO Open_Orders VALUES (DEFAULT, 5, 5, TRUE, 15, 6500);
-- INSERT INTO Open_Orders VALUES (DEFAULT, 6, 6, FALSE, 30, 6600);
-- INSERT INTO Open_Orders VALUES (DEFAULT, 7, 7, TRUE, 28, 6700);
-- INSERT INTO Open_Orders VALUES (DEFAULT, 8, 8, FALSE, 2, 6800);
-- INSERT INTO Open_Orders VALUES (DEFAULT, 9, 9, TRUE, 16, 6900);
-- INSERT INTO Open_Orders VALUES (DEFAULT, 10, 10, FALSE, 25, 7000);
