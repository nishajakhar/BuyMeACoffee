# Buy Me A Coffee

This project is a Dapp which allows users to donate ethers to a contract address.


## Requirements
Alchemy Account
Alchemy Goerli API Key and URL
Nodejs
NPM
Ethereum supported account's Private Key
## Steps to run the application:
--------
Copy .env-example file to .env
``` cp .env-example .env```

Now You will need to replace your alchemy url, api key and private key in .env file

```
npx hardhat compile
npx hardhat run scripts/deploy.js --network goerli```

Copy the contract address from the console. We have to paste it in our frontend folder to interact with it


## Steps to run frontend:
-------
1. Run the commands 
```
cd frontend
// Now paste the contract address under BMAC_CONTRACT_ADDRESS 
// in src/constants/buyMeACoffee.js file
npm build
npm start
```
2. Go to browser and type the url
http://localhost/3000



