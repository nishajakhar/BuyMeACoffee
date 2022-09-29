
const hre = require("hardhat");
const {abi} = require("../artifacts/contracts/BuyMeACoffee.sol/BuyMeACoffee.json");

async function getBalance(provider, address) {
  const balanceBigInt = await provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

async function main() {

  const contractAddress="0x6870e4a7F807838f7e76B1E179656161447164D9";

  const provider = new hre.ethers.providers.AlchemyProvider("goerli", process.env.ALCHEMY_API_KEY);

  const signer = new hre.ethers.Wallet(process.env.ACCOUNT_PRIVATE_KEY, provider);

  const buyMeACoffee = new hre.ethers.Contract(contractAddress, abi, signer);

  // Check starting balances.
  console.log("Owner Balance: ", await getBalance(provider, signer.address), "ETH");
  const contractBalance = await getBalance(provider, buyMeACoffee.address);
  console.log("Contract Balance: ", await getBalance(provider, buyMeACoffee.address), "ETH");

  if (contractBalance !== "0.0") {
    console.log("Withdraw Funds in Progress....")
    const withdraw = await buyMeACoffee.withdraw();
    await withdraw.wait();
  } else {
    console.log("No Funds in Contract!");
  }

  console.log("After Owner Balance: ", await getBalance(provider, signer.address), "ETH");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });