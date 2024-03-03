const { ethers } = require('hardhat');

require('dotenv').config();

async function main() {
  const contractFactory = await ethers.getContractFactory('VotingApp');
  const deployedContract = await contractFactory.deploy();
  console.log(deployedContract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
