#!/usr/bin/env node
require('dotenv').config();
const ethers = require("ethers")
const axios = require("axios")

// Colours
const red = '\x1b[31m'
const green = '\x1b[32m'
const yellow = '\x1b[33m'
const blue = '\x1b[34m'
const magenta = '\x1b[35m'
const cyan = '\x1b[36m'
const white = '\x1b[37m'
const bgreen = '\x1b[32;1m'
const bblue = '\x1b[34;1m'
const reset = '\x1b[0m'

// Polygon settings
const rpc_url = "https://polygon-rpc.com/"
const chain_id = 137
const explorer = "https://polygonscan.com/"

// Wallet details
const wallet_key = process.env.WALLET_KEY

// Aavegotchi list
const gotchi_list = process.env.TOKEN_IDS

// Aavegotchi contract address
const gotchi_address = "0x86935F11C86623deC8a25696E1C19a8659CbF95d"

// Check we got a valid wallet_key
if(wallet_key===null || wallet_key.length!=64) {
    console.log(`${prettyDate()}Wallet key is invalid.  It should be 64 characters in length`)
    process.exit(1)        
}

// Setup wallet provider for Polygon
const provider = new ethers.providers.JsonRpcProvider(rpc_url, chain_id);
const wallet = new ethers.Wallet(wallet_key)
const signer = wallet.connect(provider);

// Aavegotchi contract functions
const gotchi_contract = new ethers.Contract(
    gotchi_address,
    [
        "function interact(uint256[])"
    ],
    provider
);

// Delay function
const delay = time => new Promise(res => setTimeout(res,time));

// Return the date as a string
const prettyDate = () => {
    const date = new Date().toISOString()
    return `${magenta}${date}: ${reset}`
}

// Get gas fees
const getGasFees = async () => {
    try {
        const { data } = await axios({
            method: 'get', url: 'https://gasstation-mainnet.matic.network/v2'
        })
        // Get Standard gas estimates
        maxFeePerGas = ethers.utils.parseUnits(Math.ceil(data.standard.maxFee) + '', 'gwei')
        maxPriorityFeePerGas = ethers.utils.parseUnits(Math.ceil(data.standard.maxPriorityFee) + '', 'gwei')
        console.log(`${prettyDate()}Using gas estimates - maxFeePerGas ${yellow}${ethers.utils.formatUnits(maxFeePerGas, "gwei")}${reset} gwei, maxPriorityFeePerGas ${yellow}${ethers.utils.formatUnits(maxPriorityFeePerGas, "gwei")} gwei${reset}`)
        return {maxFeePerGas, maxPriorityFeePerGas}
    } catch (error) {
        console.log(`${prettyDate()}Error ${error} estimating gas`)
        return null
    }
}

// Wait for just over 12 hours
const waitNextPet = async () => {
    for(i=0; i<12; i++) {
        console.log(`${prettyDate()}Waiting ${12-i} hours until next pet transaction`)
        // Wait for one hour
        await delay(1000 * 60 * 60)
    }
    // Wait an addtional 5 mins to ensure no overlap
    console.log(`${prettyDate()}Waiting an additional 5 minutes before submitting transaction`)
    await delay(1000 * 60 * 5)
}

// Start main loop
main()

// Main loop.  Will send a pet transaction then wait 12 hours to send the next
async function main()
{
    // Check we got a valid array of gotchis
    if(gotchi_list===null || gotchi_list.length==0) {
        console.log(`${prettyDate()}List of Aavegotchi token ids has not been defined`)
        process.exit(1)        
    }
    const _gotchi_array = gotchi_list.split(",")
    console.log(`${prettyDate()}Setup list of token ids: ${_gotchi_array} and array length ${_gotchi_array.length}`)


    // Connect to the aavegotchi contract
    const _gotchi_signer = gotchi_contract.connect(signer)
    console.log(`${prettyDate()}Using wallet with address ${yellow}${signer.address}${reset}`)

    // Loop forever
    while(1) {
        // Calculate gas price data (EIP-1559)
        const _gas_data = await getGasFees()
        try {
            // Populate transaction with contract data
            const _txn = await _gotchi_signer.interact(_gotchi_array, {
                value: "0",                                                        // Zero value
                type: 2,                                                           // EIP-1559 contract
                maxFeePerGas: _gas_data.maxFeePerGas.toString(),                   // Max gas fee
                maxPriorityFeePerGas: _gas_data.maxPriorityFeePerGas.toString()    // Max priority fee                
            })
            console.log(`${prettyDate()}Send transaction returned txn hash ${_txn.hash}`)
            const _receipt = await _txn.wait()
            // This is entered if the transaction receipt indicates success
            console.log(`${prettyDate()}${green}Created Pet transaction with hash ${cyan}${explorer}/tx/${_receipt.transactionHash}${reset}`)    
        } catch (error) {
            // This is entered if the status of the receipt is failure
            console.log(`${prettyDate()}${red}Pet transaction failed with error: ${yellow}${error}${reset}`);
        }
        // Now wait 12 hours for next pet transaction
        await waitNextPet()
        // Then repeat
    }
}