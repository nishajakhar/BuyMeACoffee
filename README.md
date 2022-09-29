# Buy Me A Coffee :coffee:

This project is a Dapp which allows users to donate ethers to a contract address.

![App Image](https://raw.githubusercontent.com/nishajakhar/BuyMeACoffee/master/frontend/public/App.png)


## Requirements :hammer:
- Alchemy Account
- Alchemy Goerli API Key and URL
- Nodejs
- NPM
- Ethereum supported account's Private Key
## Steps to run the application :construction_worker_man:

1. Copy .env-example file to .env
``` cp .env-example .env```

2. Now You will need to replace your alchemy url, api key and private key in .env file

3. Now compile and deploy the contract using hardhat
```
npx hardhat compile
npx hardhat run scripts/deploy.js --network goerli
```


4. Copy the contract address from the console. We have to paste it in our frontend folder to interact with it


## Steps to run frontend: :unicorn:

1. Get into the directory
```
cd frontend
```
2. Now paste the contract address under BMAC_CONTRACT_ADDRESS in src/constants/buyMeACoffee.js file

3 Now create the build and start the server
```
npm build
npm start
```
4. Go to browser and type the url
http://localhost:3000



