const { ethers } = require('hardhat');

require('dotenv').config();

async function main() {
  const signers = await ethers.getSigners();
  signers.forEach(signer => {
    console.log(signer.getAddress());
  })
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
