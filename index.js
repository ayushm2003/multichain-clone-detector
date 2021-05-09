//require('dotenv').config();
const {ethers} = require('ethers');
const fs = require('fs');
const stringSimilarity = require("string-similarity");
const EthDater = require('ethereum-block-by-date');
const Web3 = require('web3');

let bytecode = fs.readFileSync('bytecode.txt', 'utf8');


async function detect(time, rpcURL) {

	const provider = ethers.getDefaultProvider(rpcURL);

	let latestBlock = await provider.getBlockNumber();

	const dater = new EthDater(
		new Web3(rpcURL)    
	);
	let block = await dater.getDate(
		time, // Date, required. Any valid moment.js value: string, milliseconds, Date() object, moment() object.
		true // Block after, optional. Search for the nearest block before or after the given date. By default true.
	)
	let fromBlock = block.block;

	for (i = fromBlock; i <= latestBlock; i ++) {
		let result = await provider.getBlockWithTransactions(
		i)

		let transactions = result.transactions;
		
		for(j=0; j < transactions.length; j++) {
			
			if (transactions[j].to == null) {
				if (stringSimilarity.compareTwoStrings(transactions[j].data, bytecode) >= 0.8)
					console.log(transactions[j].hash)
			}
		}
	}
}


//detect('2021-05-09T13:20:40Z', "https://rinkeby-light.eth.linkpool.io").then(() => process.exit(0));

async function main() {
	networks = ['https://main-light.eth.linkpool.io', 'https://bsc-dataseed.binance.org/', 'https://rinkeby-light.eth.linkpool.io'];

	for (n=0; n < networks.length; n++) {
		console.log("analyzing", networks[n]);
		
		// Date, required. Any valid moment.js value: string, milliseconds, Date() object, moment() object
		await detect('2021-05-09T13:20:40Z', networks[n]);
	}
}

main()