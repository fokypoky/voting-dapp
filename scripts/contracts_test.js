const { ethers } = require('hardhat');

async function main() {
    const votingApp = await (await ethers.getContractFactory('VotingApp')).deploy();

    const user = await ethers.getSigner('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
    const user2 = await ethers.getSigner('0xa0Ee7A142d267C1f36714E4a8F75612F20a79720');

    const tx = await votingApp.connect(user).addVoting('Cars', 'Cars to buy');
    const contracts = await votingApp.connect(user).getUserVotings();
    
    console.log(contracts[0]['contractAddress']);
    const userContract = await ethers.getContractAt("UserVoting",  contracts[0]['contractAddress']);

    await userContract.connect(user).addLot('Ford mustang');
    await userContract.connect(user).addLot('Toyota corolla');

    await userContract.connect(user).vote('Ford mustang');
    await userContract.connect(user2).vote('Ford mustang');

    const result = await userContract.connect(user).getResult();
    console.log(result);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});