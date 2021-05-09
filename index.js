const {ethers} = require('ethers');
const fs = require('fs');
const stringSimilarity = require("string-similarity");

let bytecode = fs.readFileSync('bytecode.txt', 'utf8');


async function main(blockNum, rpcURL) {

	const provider = ethers.getDefaultProvider(rpcURL);

	let latestBlock = await provider.getBlockNumber();

	for (i = blockNum; i <= latestBlock; i ++) {
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


main(10202112, 'ropsten').then(() => process.exit(0));