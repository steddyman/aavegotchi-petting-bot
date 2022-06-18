# Aavegotchi Petting Bot
  
This is an auto petting bot for your Aavegotchi.  It can accept an array of Aavegotchi ID's and will pet each of them every 12 hours.

## Setup
### Pre-requisites

This is a NodeJS application (script) so to use it you first need NodeJS installed on your operating system.  For instructions on how to install NodeJS, follow the official documentation here: [Node Downloads](https://nodejs.org/en/download/).

The preferred method of installing Node on Mac and Linux is via your preferred package manager, e.g. [Homebrew](https://brew.sh/) for MacOS.

### Bot Setup

Clone this repository into a new directory (or download the ZIP and extract it) then change into the directory containing this readme.md file and execute the following command:
```
npm install
```
This will download all the dependencies required for the bot and install them into a **node_modules** directory.

### Bot Configuration

Before the bot is able to submit the Petting transactions on your behalf it needs to be confgured with the **private key** for the wallet that contains your Aavegotchi's and the list of **token_ids** to pet.  Your private key grants access to everything in your wallet so you should never share it with anyone.  Never check your private key into a github repo or any other shared repository.  If you want to be doubly safe, create a new wallet just for the purpose of using this script, and transfer your Aavegotchis to that wallet.

This project contains no compiled code, so you can read the code for yourself in **index.js** and confirm for yourself that it is only used for the **Interact** function required for petting.  

You have two ways of configuring the private key and token_id list either by setting environment variables prior to running the script, or by creating a **.env** file in the same directory as **index.js**.

#### Using an .env file
To use a **.env** file create a new file in the same directory as the **index.js** with the following contents:
```
WALLET_KEY="YOUR_WALLET_PRIVATE_KEY_GOES_HERE"
TOKEN_IDS="12345,16999"
```
The Wallet Private key needs to be exactly 64 characters in length.  To find the **private_key** for your metamask wallet, click the three dots (...) to the right of your account name, and select Account Details.  On the screen that shows your barcode, click the **Export Private Key** button, enter your Metamask password then copy the Private key shown.

#### Using environment variables

If you don't want to create an **.env** file you can set environment variables on your system prior to running the script.  
To set environment variables under windows, use the **SET** command, for example:
```
set TOKEN_IDS="12345,16999"
```
To set environment variables under MacOS and Linux, use the export command, for example:
```
export TOKEN_IDS="12345,16999"
```

## Running the Bot
To run the bot, from your terminal / console, change into the directory containing the **index.js** file and run the following command:
```
npm start
```
The bot will then start running and will display your wallet address and will then immediately try and pet all of your Aavegotchis in a single transaction.  This reduces the gas costs of petting your Aavegotchis.

Once the transaction is confirmed, the script will then wait for 12 hours and will then start the petting cycle again.

## Contributions

If you wish to contribute a small amount of ETH or MATIC to support this and other projects I am working on, then please send your donations to the following address: 
<div align="center"><strong>0x066f41B92B11127073f8fc14cfBC99E6f6fC6481</strong></div>
<p align="center">
  <img width="200" src="./acc3_wallet.png" alt="Material Bread logo">
</p>