// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require('hardhat');

async function getBalance(address) {
  const balanceBigInt = await hre.waffle.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

async function printBalances(addresses) {
  for (let i = 0; i < addresses.length; i++) {
    console.log(`${addresses.name} Address ${addresses.address} Balance :  `, await getBalance(addresses.address));
  }
}

async function printMemos(memos) {
  for (let i = 0; i < memos.length; i++) {
    console.log(
      `Your new donater ${memos[i].name} from Address ${memos.donater} donated you ${memos.amount} and said "${memos.message}" at ${memos.timestamp}`,
    );
  }
}

async function main() {
  const [owner, donater, donater2, donater3] = await hre.ethers.getSigner();
  const BuyMeACoffee = await hre.ethers.getContractFactory('BuyMeACoffee');
  const buyMeACoffee = await BuyMeACoffee.deploy();

  await buyMeACoffee.deployed();

  console.log(`Contract deployed to ${buyMeACoffee.address}`);
  console.log('Initial Balances');
  console.log('------------------------------------------------------------------------');

  await printBalances([
    { name: 'Owner', address: owner },
    { name: 'Donater', address: donater },
    { name: 'Contract', address: buyMeACoffee.address },
  ]);

  const amount = await hre.ethers.utils.parseEther('1');
  await buyMeACoffee.connect(donater).buyMeACoffee('Supriya', 'Awesome Work', tip);
  await buyMeACoffee.connect(donater2).buyMeACoffee('Akshay', 'Amazing blogs', tip);
  await buyMeACoffee.connect(donater3).buyMeACoffee('Neelam', 'Love your enthusiasm', tip);

  console.log('After Donate Balances');
  console.log('------------------------------------------------------------------------');

  await printBalances([
    { name: 'Owner', address: owner },
    { name: 'Donater', address: donater },
    { name: 'Contract', address: buyMeACoffee.address },
  ]);

  console.log('Withdraw');
  console.log('------------------------------------------------------------------------');

  await buyMeACoffee.connect(owner).withdraw();
  await printBalances([{ name: 'Owner', address: owner }]);

  console.log('Memos');
  console.log('------------------------------------------------------------------------');

  const memos = await buyMeACoffee.getMemos();

  printMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
